import express from "express";
import { AuthController } from "./auth.controller";
import authMiddleware from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";
import { Role } from "../../generated/prisma/client";

const router = express.Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.registerUser
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

router.post("/refresh-token", validateRequest(AuthValidation.refreshTokenValidation), AuthController.getNewToken);

router.get(
  "/verify-email/:token",
  validateRequest(AuthValidation.verifyEmailTokenValidation),
  AuthController.verifyEmail
);

router.post(
  "/forget-password",
  validateRequest(AuthValidation.forgetPasswordSchema),
  AuthController.forgetPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword
);

router.get("/me", authMiddleware(Role.CUSTOMER, Role.SELLER, Role.ADMIN), AuthController.getMe);

router.post(
  "/change-password",
  authMiddleware(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthController.changePassword
);

router.post("/logout", validateRequest(AuthValidation.refreshTokenValidation), AuthController.logoutUser);

router.get(
  "/login/google",
  validateRequest(AuthValidation.googleLoginQueryValidation),
  AuthController.googleLogin
);
router.get("/google/success", validateRequest(AuthValidation.googleSuccessQueryValidation), AuthController.googleLoginSuccess);
router.get(
  "/oauth/error",
  validateRequest(AuthValidation.oauthErrorQueryValidation),
  AuthController.handleOAuthError
);

export const AuthRoutes = router;
