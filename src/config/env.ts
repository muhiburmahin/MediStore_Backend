import "dotenv/config";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

function looksLikeLocalhost(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/** Hostname only, e.g. medi-store-backend-wheat.vercel.app (no scheme, no path). */
function vercelDeploymentHost(): string | undefined {
  const raw =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    process.env.VERCEL_BRANCH_URL;
  if (!raw) return undefined;
  return raw
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "")
    .split("/")[0]
    ?.trim();
}

function resolveBackendUrl(): string {
  const explicit = process.env.BACKEND_URL?.trim();
  if (explicit && !looksLikeLocalhost(explicit)) {
    return explicit.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "production") {
    const h = vercelDeploymentHost();
    if (h) return `https://${h}`;
  }
  return explicit || "http://localhost:5000";
}

function resolveBetterAuthUrl(): string {
  const explicit = process.env.BETTER_AUTH_URL?.trim();
  if (explicit && !looksLikeLocalhost(explicit)) {
    return explicit.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "production") {
    const h = vercelDeploymentHost();
    if (h) return `https://${h}/api/auth`;
  }
  return explicit || "http://localhost:5000/api/auth";
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  BETTER_AUTH_URL: resolveBetterAuthUrl(),
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || required("BETTER_AUTH_SECRET"),
  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:3000",
  BACKEND_URL: resolveBackendUrl(),
  APP_URL: process.env.APP_URL ?? process.env.FRONTEND_URL ?? "http://localhost:3000",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",
  APP_USER: process.env.APP_USER ?? "",
  APP_PASS: process.env.APP_PASS ?? "",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? "",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
};
