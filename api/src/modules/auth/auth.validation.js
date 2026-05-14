import { z } from "zod/v3";
const registerValidationSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        role: z.enum(["CUSTOMER", "SELLER"]).optional(),
        phone: z.string().optional(),
    }),
});
const loginValidationSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
});
const forgetPasswordSchema = z.object({
    body: z.object({
        email: z.string().email(),
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
//# sourceMappingURL=auth.validation.js.map