import status from "http-status";
import jwt, { Secret } from "jsonwebtoken";
import { fromNodeHeaders } from "better-auth/node";
import type { Request } from "express";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { tokenUtils, type JwtPayload } from "../../utils/token";
import { ILoginUserPayload, IRegisterUserPayload } from "./auth.interface";
import { AppError } from "../../middleware/appError";
import { Role, UserStatus } from "../../generated/prisma/client";

async function readBetterAuthJson(webRes: globalThis.Response) {
  const clone = webRes.clone();
  try {
    return await clone.json();
  } catch {
    return null;
  }
}

const registerUser = async (req: Request, payload: IRegisterUserPayload) => {
  const requestedRole = payload.role as string | undefined;
  if (requestedRole === Role.ADMIN || requestedRole === "ADMIN") {
    throw new AppError("Self-registration as ADMIN is not allowed", status.FORBIDDEN);
  }
  const role: Role = requestedRole === Role.SELLER || requestedRole === "SELLER" ? Role.SELLER : Role.CUSTOMER;

  const webRes = (await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role,
      phone: payload.phone ?? undefined,
    },
    headers: fromNodeHeaders(req.headers),
    asResponse: true,
  } as never)) as globalThis.Response;

  if (!webRes.ok) {
    const errBody = await readBetterAuthJson(webRes);
    const msg =
      errBody && typeof errBody === "object" && errBody !== null && "message" in errBody
        ? String((errBody as { message?: string }).message)
        : "Registration failed";
    throw new AppError(msg, webRes.status >= 400 && webRes.status < 600 ? webRes.status : status.BAD_REQUEST);
  }

  const data = await readBetterAuthJson(webRes);
  return { webRes, data };
};

const loginUser = async (req: Request, payload: ILoginUserPayload) => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) throw new AppError("Invalid email or password", status.UNAUTHORIZED);
  if (user.status === UserStatus.BANNED) {
    throw new AppError("Your account has been suspended", status.FORBIDDEN);
  }

  const webRes = (await auth.api.signInEmail({
    body: { email: payload.email, password: payload.password },
    headers: fromNodeHeaders(req.headers),
    asResponse: true,
  } as never)) as globalThis.Response;

  if (!webRes.ok) {
    const errBody = await readBetterAuthJson(webRes);
    const msg =
      errBody && typeof errBody === "object" && errBody !== null && "message" in errBody
        ? String((errBody as { message?: string }).message)
        : "Invalid email or password";
    throw new AppError(msg, status.UNAUTHORIZED);
  }

  const data = (await readBetterAuthJson(webRes)) as {
    user?: { id: string; email: string; role?: string };
    token?: string;
  } | null;

  let jwtPair: { accessToken: string; refreshToken: string } | undefined;
  if (env.JWT_ACCESS_SECRET && env.JWT_REFRESH_SECRET && data?.user) {
    const jwtPayload: JwtPayload = {
      id: data.user.id,
      email: data.user.email,
      role: (data.user.role as Role) ?? Role.CUSTOMER,
    };
    jwtPair = {
      accessToken: tokenUtils.getAccessToken(jwtPayload),
      refreshToken: tokenUtils.getRefreshToken(jwtPayload),
    };
  }

  return { webRes, data, jwtPair };
};

const requestPasswordReset = async (req: Request, email: string, redirectTo?: string) => {
  const webRes = (await auth.api.requestPasswordReset({
    body: { email, redirectTo },
    headers: fromNodeHeaders(req.headers),
    asResponse: true,
  } as never)) as globalThis.Response;

  if (!webRes.ok) {
    const errBody = await readBetterAuthJson(webRes);
    const msg =
      errBody && typeof errBody === "object" && errBody !== null && "message" in errBody
        ? String((errBody as { message?: string }).message)
        : "Could not process password reset";
    throw new AppError(msg, status.BAD_REQUEST);
  }
  return readBetterAuthJson(webRes);
};

const resetPasswordWithToken = async (req: Request, token: string, newPassword: string) => {
  const webRes = (await auth.api.resetPassword({
    body: { newPassword, token },
    headers: fromNodeHeaders(req.headers),
    asResponse: true,
  } as never)) as globalThis.Response;

  if (!webRes.ok) {
    const errBody = await readBetterAuthJson(webRes);
    const msg =
      errBody && typeof errBody === "object" && errBody !== null && "message" in errBody
        ? String((errBody as { message?: string }).message)
        : "Invalid or expired token";
    throw new AppError(msg, status.BAD_REQUEST);
  }
  return readBetterAuthJson(webRes);
};

const changePassword = async (req: Request, currentPassword: string, newPassword: string) => {
  const webRes = (await auth.api.changePassword({
    body: { currentPassword, newPassword },
    headers: fromNodeHeaders(req.headers),
    asResponse: true,
  } as never)) as globalThis.Response;

  if (!webRes.ok) {
    const errBody = await readBetterAuthJson(webRes);
    const msg =
      errBody && typeof errBody === "object" && errBody !== null && "message" in errBody
        ? String((errBody as { message?: string }).message)
        : "Could not change password";
    throw new AppError(msg, status.BAD_REQUEST);
  }
  return readBetterAuthJson(webRes);
};

const logoutUser = async (req: Request) => {
  const webRes = (await auth.api.signOut({
    headers: fromNodeHeaders(req.headers),
    asResponse: true,
  } as never)) as globalThis.Response;
  return webRes;
};

const refreshToken = async (token: string) => {
  if (!token) throw new AppError("Session expired, please login again", status.UNAUTHORIZED);
  if (!env.JWT_REFRESH_SECRET) {
    throw new AppError("JWT refresh is not configured; use Better Auth session cookies", status.NOT_IMPLEMENTED);
  }
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET as Secret) as JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new AppError("User not found", status.UNAUTHORIZED);
    if (user.status === UserStatus.BANNED) throw new AppError("Account suspended", status.FORBIDDEN);
    const accessToken = tokenUtils.getAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return { accessToken };
  } catch {
    throw new AppError("Invalid or expired refresh token", status.UNAUTHORIZED);
  }
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
    },
  });
  if (!user) throw new AppError("User not found", status.NOT_FOUND);
  return user;
};

const googleLoginSuccess = async (session: { user: { id: string; email: string; role?: string } }) => {
  let jwtPair: { accessToken: string; refreshToken: string } | undefined;
  if (env.JWT_ACCESS_SECRET && env.JWT_REFRESH_SECRET) {
    const u = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (u) {
      jwtPair = {
        accessToken: tokenUtils.getAccessToken({
          id: u.id,
          email: u.email,
          role: u.role,
        }),
        refreshToken: tokenUtils.getRefreshToken({
          id: u.id,
          email: u.email,
          role: u.role,
        }),
      };
    }
  }
  return jwtPair;
};

export const AuthService = {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPasswordWithToken,
  changePassword,
  refreshToken,
  getMe,
  googleLoginSuccess,
  logoutUser,
};
