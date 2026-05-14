import status from "http-status";
import { AuthService } from "./auth.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { env } from "../../config/env";
import { auth } from "../../lib/auth";
import { applyWebResponseCookies } from "../../utils/forwardWebResponse";
const cookieOptions = {
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: (env.NODE_ENV === "production" ? "none" : "lax"),
    path: "/",
};
const registerUser = catchAsync(async (req, res) => {
    const { webRes, data } = await AuthService.registerUser(req, req.body);
    applyWebResponseCookies(res, webRes);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "User registered successfully",
        data,
    });
});
const loginUser = catchAsync(async (req, res) => {
    const { webRes, data, jwtPair } = await AuthService.loginUser(req, req.body);
    applyWebResponseCookies(res, webRes);
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
const verifyEmail = catchAsync(async (req, res) => {
    const token = req.params.token;
    const target = new URL(`${env.BETTER_AUTH_URL.replace(/\/$/, "")}/verify-email`);
    target.searchParams.set("token", token);
    target.searchParams.set("callbackURL", `${env.FRONTEND_URL.replace(/\/$/, "")}/?verified=true`);
    res.redirect(target.toString());
});
const forgetPassword = catchAsync(async (req, res) => {
    const { email, redirectTo } = req.body;
    const result = await AuthService.requestPasswordReset(req, email, redirectTo);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "If an account exists for this email, you will receive reset instructions.",
        data: result,
    });
});
const resetPassword = catchAsync(async (req, res) => {
    const { token, newPassword } = req.body;
    const result = await AuthService.resetPasswordWithToken(req, token, newPassword);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Password updated successfully",
        data: result,
    });
});
const getMe = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await AuthService.getMe(userId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User data retrieved successfully",
        data: result,
    });
});
const changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword, oldPassword } = req.body;
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
const getNewToken = catchAsync(async (req, res) => {
    const { refreshToken: rt } = req.cookies;
    const result = await AuthService.refreshToken(rt ?? "");
    res.cookie("accessToken", result.accessToken, cookieOptions);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "New access token generated",
        data: { accessToken: result.accessToken },
    });
});
const logoutUser = catchAsync(async (req, res) => {
    const webRes = await AuthService.logoutUser(req);
    applyWebResponseCookies(res, webRes);
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Logged out successfully",
        data: null,
    });
});
const googleLogin = catchAsync(async (req, res) => {
    const redirectPath = req.query.redirect || "/dashboard";
    const base = env.BETTER_AUTH_URL.replace(/\/$/, "");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Continue with Google</title></head><body>
<script>
(function(){
  var base = ${JSON.stringify(base)};
  var redirect = ${JSON.stringify(redirectPath)};
  var cb = ${JSON.stringify(`${env.BACKEND_URL.replace(/\/$/, "")}/api/v1/auth/google/success`)} + '?redirect=' + encodeURIComponent(redirect);
  fetch(base + '/sign-in/social', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'google', callbackURL: cb })
  }).then(function(r){ return r.json(); }).then(function(d){
    if (d && d.url) window.location.href = d.url;
    else document.body.innerHTML = '<p>Could not start Google sign-in. Ensure Google OAuth is configured.</p>';
  }).catch(function(){ document.body.innerHTML = '<p>Could not start Google sign-in.</p>'; });
})();
</script><p>Redirecting to Google…</p></body></html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
});
const googleLoginSuccess = catchAsync(async (req, res) => {
    const redirectPath = req.query.redirect || "/dashboard";
    const sessionToken = req.cookies["better-auth.session_token"];
    if (!sessionToken) {
        return res.redirect(`${env.FRONTEND_URL}/login?error=oauth_failed`);
    }
    const session = await auth.api.getSession({
        headers: new Headers({ Cookie: `better-auth.session_token=${sessionToken}` }),
    });
    if (!session?.user) {
        return res.redirect(`${env.FRONTEND_URL}/login?error=no_session_found`);
    }
    const jwtPair = await AuthService.googleLoginSuccess(session);
    const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
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
const handleOAuthError = catchAsync((req, res, _next) => {
    const error = req.query.error || "oauth_failed";
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
//# sourceMappingURL=auth.controller.js.map