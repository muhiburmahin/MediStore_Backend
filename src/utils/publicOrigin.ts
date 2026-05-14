import type { Request } from "express";
import { env } from "../config/env";

/**
 * Public origin for this API (OAuth callback, redirects).
 * Prefer resolved `env.BACKEND_URL` (includes Vercel fallbacks in production), then `Host`.
 * Do not use `x-forwarded-host` alone — Next.js rewrites can send the frontend host.
 */
export function publicApiOrigin(req: Request): string {
  try {
    const origin = new URL(env.BACKEND_URL).origin;
    if (!/localhost|127\.0\.0\.1/i.test(origin)) return origin;
  } catch {
    /* fall through */
  }

  const vu =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    process.env.VERCEL_BRANCH_URL;
  if (vu) {
    const host = vu.replace(/^https?:\/\//i, "").replace(/\/$/, "").split("/")[0]?.trim();
    if (host) return `https://${host}`;
  }

  const hostHeader = req.get("host")?.trim();
  if (
    hostHeader &&
    !/^localhost(:\d+)?$/i.test(hostHeader) &&
    !/^127\.0\.0\.1(:\d+)?$/i.test(hostHeader)
  ) {
    return `https://${hostHeader}`;
  }

  try {
    return new URL(env.BACKEND_URL).origin;
  } catch {
    return "http://localhost:5000";
  }
}
