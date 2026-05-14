import { z } from "zod/v3";
export declare const AuthValidation: {
    registerValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
            role: z.ZodOptional<z.ZodEnum<["CUSTOMER", "SELLER"]>>;
            phone: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            email: string;
            password: string;
            role?: "CUSTOMER" | "SELLER" | undefined;
            phone?: string | undefined;
        }, {
            name: string;
            email: string;
            password: string;
            role?: "CUSTOMER" | "SELLER" | undefined;
            phone?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            name: string;
            email: string;
            password: string;
            role?: "CUSTOMER" | "SELLER" | undefined;
            phone?: string | undefined;
        };
    }, {
        body: {
            name: string;
            email: string;
            password: string;
            role?: "CUSTOMER" | "SELLER" | undefined;
            phone?: string | undefined;
        };
    }>;
    loginValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
            password: string;
        }, {
            email: string;
            password: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
            password: string;
        };
    }, {
        body: {
            email: string;
            password: string;
        };
    }>;
    forgetPasswordSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            redirectTo: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            redirectTo?: string | undefined;
        }, {
            email: string;
            redirectTo?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
            redirectTo?: string | undefined;
        };
    }, {
        body: {
            email: string;
            redirectTo?: string | undefined;
        };
    }>;
    resetPasswordSchema: z.ZodObject<{
        body: z.ZodObject<{
            token: z.ZodString;
            newPassword: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            token: string;
            newPassword: string;
        }, {
            token: string;
            newPassword: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            token: string;
            newPassword: string;
        };
    }, {
        body: {
            token: string;
            newPassword: string;
        };
    }>;
    changePasswordSchema: z.ZodObject<{
        body: z.ZodObject<{
            currentPassword: z.ZodOptional<z.ZodString>;
            oldPassword: z.ZodOptional<z.ZodString>;
            newPassword: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            newPassword: string;
            currentPassword?: string | undefined;
            oldPassword?: string | undefined;
        }, {
            newPassword: string;
            currentPassword?: string | undefined;
            oldPassword?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            newPassword: string;
            currentPassword?: string | undefined;
            oldPassword?: string | undefined;
        };
    }, {
        body: {
            newPassword: string;
            currentPassword?: string | undefined;
            oldPassword?: string | undefined;
        };
    }>;
    refreshTokenValidation: z.ZodObject<{
        body: z.ZodEffects<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>, Record<string, unknown>, Record<string, unknown> | undefined>;
    }, "strip", z.ZodTypeAny, {
        body: Record<string, unknown>;
    }, {
        body?: Record<string, unknown> | undefined;
    }>;
    verifyEmailTokenValidation: z.ZodObject<{
        params: z.ZodObject<{
            token: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            token: string;
        }, {
            token: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        params: {
            token: string;
        };
    }, {
        params: {
            token: string;
        };
    }>;
    googleLoginQueryValidation: z.ZodObject<{
        query: z.ZodObject<{
            redirect: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            redirect?: string | undefined;
        }, {
            redirect?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        query: {
            redirect?: string | undefined;
        };
    }, {
        query: {
            redirect?: string | undefined;
        };
    }>;
    googleSuccessQueryValidation: z.ZodObject<{
        query: z.ZodObject<{
            redirect: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            redirect?: string | undefined;
        }, {
            redirect?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        query: {
            redirect?: string | undefined;
        };
    }, {
        query: {
            redirect?: string | undefined;
        };
    }>;
    oauthErrorQueryValidation: z.ZodObject<{
        query: z.ZodObject<{
            error: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            error?: string | undefined;
        }, {
            error?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        query: {
            error?: string | undefined;
        };
    }, {
        query: {
            error?: string | undefined;
        };
    }>;
};
//# sourceMappingURL=auth.validation.d.ts.map