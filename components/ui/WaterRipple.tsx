'use client';

import { useEffect, useRef } from 'react';

const VERT = `
precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;
void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;

varying vec2 vUv;
uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_blueish;
uniform float u_scale;
uniform float u_illumination;
uniform float u_surface_distortion;
uniform float u_water_distortion;

vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
  m = m*m;
  m = m*m;
  vec3 x = 2. * fract(p * C.www) - 1.;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}

mat2 rotate2D(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float surface_noise(vec2 uv, float t, float scale) {
  vec2 n = vec2(.1);
  vec2 N = vec2(.1);
  mat2 m = rotate2D(.5);
  for (int j = 0; j < 10; j++) {
    uv *= m;
    n *= m;
    vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
    n += sin(q);
    N += cos(q) / scale;
    scale *= 1.2;
  }
  return (N.x + N.y + .1);
}

void main() {
  vec2 uv = vUv;
  uv.y = 1. - uv.y;
  uv.x *= u_ratio;

  float t = .002 * u_time;
  vec3 color = vec3(0.);
  float opacity = 0.;

  float outer_noise = snoise((.3 + .1 * sin(t)) * uv + vec2(0., .2 * t));
  vec2 surface_noise_uv = 2. * uv + (outer_noise * .2);

  float surf = surface_noise(surface_noise_uv, t, u_scale);
  surf *= pow(uv.y, .3);
  surf = pow(surf, 2.);

  vec2 img_uv = vUv;
  img_uv += (u_water_distortion * outer_noise);
  img_uv += (u_surface_distortion * surf);
  img_uv.y = 1. - img_uv.y;

  vec4 img = texture2D(u_image_texture, img_uv);
  img *= (1. + u_illumination * surf);

  color += img.rgb;
  color += u_illumination * vec3(1. - u_blueish, 1., 1.) * surf;
  opacity += img.a;

  gl_FragColor = vec4(color, opacity);
}
`;

function compileShader(gl: WebGLRenderingContext, src: string, type: number) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    throw new Error('Shader compile error');
  }
  return sh;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const v = compileShader(gl, vs, gl.VERTEX_SHADER);
  const f = compileShader(gl, fs, gl.FRAGMENT_SHADER);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, v);
  gl.attachShader(prog, f);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteProgram(prog);
    throw new Error('Program link error');
  }
  return prog;
}

// ── Recadre l'image en 16:9 centré via un canvas temporaire ──
function cropTo16x9(img: HTMLImageElement): HTMLCanvasElement {
  const targetRatio = 16 / 9;
  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;
  const srcRatio = srcW / srcH;

  let cropW: number, cropH: number, offsetX: number, offsetY: number;

  if (srcRatio > targetRatio) {
    // Image plus large → on coupe les côtés
    cropH = srcH;
    cropW = Math.round(srcH * targetRatio);
    offsetX = Math.round((srcW - cropW) / 2);
    offsetY = 0;
  } else {
    // Image plus haute → on coupe haut/bas
    cropW = srcW;
    cropH = Math.round(srcW / targetRatio);
    offsetX = 0;
    offsetY = Math.round((srcH - cropH) / 2);
  }

  const c = document.createElement('canvas');
  c.width = Math.min(cropW, 2048);
  c.height = Math.min(cropH, 1152);
  const ctx = c.getContext('2d')!;
  ctx.drawImage(img, offsetX, offsetY, cropW, cropH, 0, 0, c.width, c.height);
  return c;
}

interface WaterRippleProps {
  src: string;
  blueish?: number;
  scale?: number;
  illumination?: number;
  surfaceDistortion?: number;
  waterDistortion?: number;
}

export function WaterRipple({
  src,
  blueish = 0.5,
  scale = 6,
  illumination = 0.12,
  surfaceDistortion = 0.04,
  waterDistortion = 0.02,
}: WaterRippleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Accessibilité — prefers-reduced-motion ──────────────────────
  // On mesure la préférence côté client pour éviter les règles de hooks.
  // Si réduction activée, le canvas reste hidden et le fallback <Image>
  // statique dans HeroSection reste seul visible.
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // Bail out : laisse le fallback statique, ne démarre pas le WebGL
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (
      canvas.getContext('webgl', { alpha: false, antialias: true }) ||
      canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
    );
    if (!gl) return;

    let animId: number;
    let texture: WebGLTexture | null = null;

    const program = createProgram(gl, VERT, FRAG);
    gl.useProgram(program);

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(program, i);
      if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(uniforms['u_blueish'], blueish);
    gl.uniform1f(uniforms['u_scale'], scale);
    gl.uniform1f(uniforms['u_illumination'], illumination);
    gl.uniform1f(uniforms['u_surface_distortion'], surfaceDistortion);
    gl.uniform1f(uniforms['u_water_distortion'], waterDistortion);
    // Ratio fixe 16:9 — l'image est recadrée donc toujours 16:9
    gl.uniform1f(uniforms['u_img_ratio'], 16 / 9);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (w === 0 || h === 0) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform1f(uniforms['u_ratio'], w / h);
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    requestAnimationFrame(resize);
    const t1 = setTimeout(resize, 100);
    const t2 = setTimeout(resize, 500);
    window.addEventListener('resize', resize);

    // Charge l'image, recadre en 16:9, upload comme texture
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const cropped = cropTo16x9(img);

      if (texture) gl.deleteTexture(texture);
      texture = gl.createTexture()!;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cropped);
      gl.uniform1i(uniforms['u_image_texture'], 0);
    };
    img.src = src;

    const render = () => {
      gl.uniform1f(uniforms['u_time'], performance.now());
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', resize);
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(animId);
      if (texture) gl.deleteTexture(texture);
      gl.deleteProgram(program);
    };
  }, [src, blueish, scale, illumination, surfaceDistortion, waterDistortion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{ display: prefersReduced ? 'none' : 'block' }}
    />
  );
}
