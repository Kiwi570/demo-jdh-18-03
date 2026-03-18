/**
 * Rate limiter — protection anti-spam des API routes
 * Basé sur un Map en mémoire (par instance serverless).
 * Pour une protection plus robuste en production, utiliser @vercel/kv ou Upstash.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Nettoyage périodique — guard pour éviter les doublons au warm-start serverless Vercel
const _global = globalThis as typeof globalThis & { __rl_cleanup?: boolean };
if (!_global.__rl_cleanup) {
  _global.__rl_cleanup = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 60_000);
}

/**
 * Vérifie si une IP a dépassé la limite de requêtes.
 * @param ip         - Adresse IP du client
 * @param maxRequests - Nombre max de requêtes autorisées (défaut : 10)
 * @param windowMs    - Fenêtre de temps en ms (défaut : 60s)
 * @returns true si la requête est autorisée, false si bloquée
 */
export function rateLimit(
  ip: string,
  maxRequests = 10,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Extrait l'IP du client depuis les headers Next.js / Vercel.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1"
  );
}
