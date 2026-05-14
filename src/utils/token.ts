import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "../generated/prisma/client";

export type JwtPayload = { id: string; email: string; role: Role };

function requireSecret(name: keyof typeof env, label: string): Secret {
  const v = env[name] as string;
  if (!v) throw new Error(`${label} is not configured`);
  return v;
}

export const tokenUtils = {
  getAccessToken(payload: JwtPayload): string {
    const secret = requireSecret("JWT_ACCESS_SECRET", "JWT_ACCESS_SECRET");
    return jwt.sign(payload, secret, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    } as SignOptions);
  },
  getRefreshToken(payload: JwtPayload): string {
    const secret = requireSecret("JWT_REFRESH_SECRET", "JWT_REFRESH_SECRET");
    return jwt.sign(payload, secret, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as SignOptions);
  },
};
