/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Mode strict React ───────────────────────────────────────────────────
  reactStrictMode: true,

  // ── Supprime le header "X-Powered-By: Next.js" (sécurité) ──────────────
  poweredByHeader: false,

  // ── Optimisation des images ─────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours
    remotePatterns: [
      { protocol: "https", hostname: "**.lesjardinsdelhacienda54.com" },
    ],
  },

  // ── Compression ────────────────────────────────────────────────────────
  compress: true,

  // ── En-têtes de sécurité ────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",         value: "SAMEORIGIN" },
          { key: "X-XSS-Protection",        value: "1; mode=block" },
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=()" },
          // CSP assoupli pour autoriser les polices Google et les images locales
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io", // unsafe-eval requis par GSAP
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://maps.googleapis.com https://maps.gstatic.com https://plausible.io",
              "connect-src 'self' https://api.resend.com https://plausible.io",
              "frame-src https://www.google.com https://maps.google.com https://maps.googleapis.com",
              "media-src 'self'",
            ].join("; "),
          },
        ],
      },
      {
        // Cache long terme sur les assets statiques
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Pas de cache sur les API routes
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },

  // ── Redirections legacy → nouvelle URL ─────────────────────────────────
  async redirects() {
    return [
      { source: "/index.html",   destination: "/",                     permanent: true },
      { source: "/menus",        destination: "/la-table",             permanent: true },
      { source: "/carte",        destination: "/la-table",             permanent: true },
      { source: "/piscine",      destination: "/les-espaces#piscine",  permanent: true },
      { source: "/mariage",      destination: "/receptions",           permanent: true },
      { source: "/mariages",     destination: "/receptions",           permanent: true },
      { source: "/reservations", destination: "/contact",              permanent: true },
      { source: "/reservation",  destination: "/contact",              permanent: true },
      { source: "/photos",       destination: "/les-photos",           permanent: true },
      { source: "/galerie",      destination: "/les-photos",           permanent: true },
    ];
  },
};

module.exports = nextConfig;
