/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import status from "http-status";
import { z } from "zod/v3";
import { AuthService } from "./auth.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { env } from "../../config/env";
import { auth } from "../../lib/auth";
import { applyWebResponseCookies } from "../../utils/forwardWebResponse";
import { publicApiOrigin } from "../../utils/publicOrigin";
import { Role } from "@prisma/client";
import { notificationService } from "../notification/notification.service";

function dashboardPathForRole(role: string | undefined): string {
  if (role === Role.ADMIN || role === "ADMIN") return "/admin-dashboard/dashboard";
  if (role === Role.SELLER || role === "SELLER") return "/seller-dashboard/dashboard";
  return "/dashboard";
}

const cookieOptions = {
  secure: env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: (env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  path: "/",
};

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { webRes, data } = await AuthService.registerUser(req, req.body);
  applyWebResponseCookies(res, webRes as any);

  const smtpOn = Boolean(env.APP_USER && env.APP_PASS);

  const regUser = (data as { user?: { id: string; name?: string } } | null)?.user;
  if (regUser?.id) {
    const welcome = smtpOn
      ? "Verify your email from the link we sent, then you can sign in."
      : "You can sign in and start exploring MediStore.";
    void notificationService
      .create(regUser.id, "Welcome to MediStore", `Hi ${regUser.name ?? "there"}, ${welcome}`, "SIGNUP")
      .catch(() => undefined);
  }

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: smtpOn
      ? "Registration successful. Please verify your email, then sign in."
      : "User registered successfully",
    data,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { webRes, data, jwtPair } = await AuthService.loginUser(req, req.body);
  applyWebResponseCookies(res, webRes as any);

  const logUser = (data as { user?: { id: string; name?: string } } | null)?.user;
  if (logUser?.id) {
    void notificationService
      .create(
        logUser.id,
        "Signed in successfully",
        `Welcome back${logUser.name ? `, ${logUser.name}` : ""}. You can check cart, orders, and notifications anytime.`,
        "LOGIN"
      )
      .catch(() => undefined);
  }

  if (jwtPair) {
    res.cookie("accessToken", jwtPair.accessToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie("refreshToken", jwtPair.refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const token = req.params.token as string;
  const target = new URL(`${env.BETTER_AUTH_URL.replace(/\/$/, "")}/verify-email`);
  target.searchParams.set("token", token);
  target.searchParams.set(
    "callbackURL",
    `${env.FRONTEND_URL.replace(/\/$/, "")}/login?verified=1`
  );
  res.redirect(target.toString());
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, redirectTo } = req.body as { email: string; redirectTo?: string };
  const result = await AuthService.requestPasswordReset(req, email, redirectTo);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "If an account exists for this email, you will receive reset instructions.",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body as { token: string; newPassword: string };
  const result = await AuthService.resetPasswordWithToken(req, token, newPassword);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password updated successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await AuthService.getMe(userId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User data retrieved successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { currentPassword, newPassword, oldPassword } = req.body as {
    currentPassword?: string;
    newPassword: string;
    oldPassword?: string;
  };
  const current = currentPassword ?? oldPassword;
  if (!current) {
    return sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: "currentPassword (or oldPassword) is required",
      data: null,
    });
  }
  const result = await AuthService.changePassword(req, current, newPassword);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const getNewToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken: rt } = req.cookies as { refreshToken?: string };
  const result = await AuthService.refreshToken(rt ?? "");
  res.cookie("accessToken", result.accessToken, cookieOptions);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "New access token generated",
    data: { accessToken: result.accessToken },
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const webRes = await AuthService.logoutUser(req);
  applyWebResponseCookies(res, webRes as any);
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const cb = `${publicApiOrigin(req)}/api/v1/auth/google/success`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Continue with Google</title></head><body>
<script>
(function(){
  var api = window.location.origin + '/api/auth/sign-in/social';
  var cb = ${JSON.stringify(cb)};
  fetch(api, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'google', callbackURL: cb })
  }).then(function(r){
    return r.text().then(function(t){
      try { return { ok: r.ok, data: JSON.parse(t) }; } catch (e) { return { ok: r.ok, data: null, raw: t }; }
    });
  }).then(function(x){
    var d = x.data;
    if (d && d.url) { window.location.href = d.url; return; }
    var msg = (d && d.message) ? String(d.message) : (x.raw ? 'Unexpected response from server.' : 'No redirect URL returned.');
    document.body.innerHTML = '<p style="font-family:system-ui,sans-serif;max-width:36rem;padding:1.5rem;">Could not start Google sign-in.</p>' +
      '<p style="font-family:system-ui,sans-serif;max-width:36rem;padding:0 1.5rem;color:#64748b;">' + msg + '</p>' +
      '<p style="font-family:system-ui,sans-serif;max-width:36rem;padding:0 1.5rem;font-size:0.875rem;color:#64748b;">Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set on the backend and restart the server.</p>';
  }).catch(function(){
    document.body.innerHTML = '<p style="font-family:system-ui,sans-serif;padding:1.5rem;">Could not start Google sign-in (network). Open this app from the same URL you use for browsing (e.g. http://localhost:3000) and confirm the backend is running.</p>';
  });
})();
</script><p>Redirecting to Google…</p></body></html>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = (req.cookies as Record<string, string | undefined>)["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${env.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: new Headers({ Cookie: `better-auth.session_token=${sessionToken}` }),
  });
  if (!session?.user) {
    return res.redirect(`${env.FRONTEND_URL}/login?error=no_session_found`);
  }
  const jwtPair = await AuthService.googleLoginSuccess(session as any);
  const finalRedirectPath = dashboardPathForRole(session.user.role as string);
  if (jwtPair) {
    res.cookie("accessToken", jwtPair.accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 });
    res.cookie("refreshToken", jwtPair.refreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 30 });
    const setCookieUrl = new URL(`${env.FRONTEND_URL.replace(/\/$/, "")}/api/auth/set-cookies`);
    setCookieUrl.searchParams.set("accessToken", jwtPair.accessToken);
    setCookieUrl.searchParams.set("refreshToken", jwtPair.refreshToken);
    setCookieUrl.searchParams.set("redirect", finalRedirectPath);
    return res.redirect(setCookieUrl.toString());
  }
  res.redirect(`${env.FRONTEND_URL.replace(/\/$/, "")}${finalRedirectPath}`);
});

const handleOAuthError = catchAsync((req: Request, res: Response, _next) => {
  const parsed = z.object({ error: z.string().optional() }).safeParse(req.query);
  const error = parsed.success && parsed.data.error ? parsed.data.error : "oauth_failed";
  res.redirect(`${env.FRONTEND_URL}/login?error=${encodeURIComponent(error)}`);
});

export const AuthController = {
  registerUser,
  loginUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  getMe,
  changePassword,
  getNewToken,
  logoutUser,
  googleLogin,
  googleLoginSuccess,
  handleOAuthError,
};
