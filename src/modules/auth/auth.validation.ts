import { z } from "zod/v3";
import { isAllowedMailboxEmail } from "../../shared/emailPolicy";

const mailboxEmail = z
  .string()
  .email("Invalid email address")
  .refine((e) => isAllowedMailboxEmail(e), {
    message: "Use a real email provider (temporary or disposable addresses are not allowed)",
  });

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: mailboxEmail,
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
      role: z.enum(["CUSTOMER", "SELLER", "ADMIN"]).optional(),
    phone: z.string().optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: mailboxEmail,
    password: z.string().min(1, "Password is required"),
  }),
});

const forgetPasswordSchema = z.object({
  body: z.object({
    email: mailboxEmail,
    redirectTo: z.string().optional(),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: z
      .string()
      .min(6)
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1).optional(),
    oldPassword: z.string().min(1).optional(),
    newPassword: z
      .string()
      .min(6)
      .regex(/[a-z]/)
      .regex(/[0-9]/),
  }),
});

const refreshTokenValidation = z.object({
  body: z
    .record(z.string(), z.unknown())
    .optional()
    .transform((b) => b ?? {}),
});

const verifyEmailTokenValidation = z.object({
  params: z.object({
    token: z.string().min(1, "Verification token is required"),
  }),
});

const googleLoginQueryValidation = z.object({
  query: z.object({
    redirect: z.string().optional(),
  }),
});

const oauthErrorQueryValidation = z.object({
  query: z.object({
    error: z.string().optional(),
  }),
});

const googleSuccessQueryValidation = z.object({
  query: z.object({
    redirect: z.string().optional(),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenValidation,
  verifyEmailTokenValidation,
  googleLoginQueryValidation,
  googleSuccessQueryValidation,
  oauthErrorQueryValidation,
};
