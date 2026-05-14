import { z } from "zod/v3";
/** PATCH /api/user/update/:id — body; admin may also send role/status */
export declare const patchUserProfileValidation: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        image: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<["CUSTOMER", "SELLER", "ADMIN"]>>;
        status: z.ZodOptional<z.ZodEnum<["ACTIVE", "BANNED"]>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        role?: "CUSTOMER" | "SELLER" | "ADMIN" | undefined;
        status?: "ACTIVE" | "BANNED" | undefined;
        phone?: string | null | undefined;
        image?: string | undefined;
    }, {
        name?: string | undefined;
        role?: "CUSTOMER" | "SELLER" | "ADMIN" | undefined;
        status?: "ACTIVE" | "BANNED" | undefined;
        phone?: string | null | undefined;
        image?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        role?: "CUSTOMER" | "SELLER" | "ADMIN" | undefined;
        status?: "ACTIVE" | "BANNED" | undefined;
        phone?: string | null | undefined;
        image?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        role?: "CUSTOMER" | "SELLER" | "ADMIN" | undefined;
        status?: "ACTIVE" | "BANNED" | undefined;
        phone?: string | null | undefined;
        image?: string | undefined;
    };
}>;
/** PATCH /api/admin/users/:id — same shape as profile patch */
export declare const adminPatchUserValidation: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        image: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<["CUSTOMER", "SELLER", "ADMIN"]>>;
        status: z.ZodOptional<z.ZodEnum<["ACTIVE", "BANNED"]>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        role?: "CUSTOMER" | "SELLER" | "ADMIN" | undefined;
        status?: "ACTIVE" | "BANNED" | undefined;
        phone?: string | null | undefined;
        image?: string | undefined;
    }, {
        name?: string | undefined;
        role?: "CUSTOMER" | "SELLER" | "ADMIN" | undefined;
        status?: "ACTIVE" | "BANNED" | undefined;
        phone?: string | null | undefined;
        image?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        role?: "CUSTOMER" | "SELLER" | "ADMIN" | undefined;
        status?: "ACTIVE" | "BANNED" | undefined;
        phone?: string | null | undefined;
        image?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        role?: "CUSTOMER" | "SELLER" | "ADMIN" | undefined;
        status?: "ACTIVE" | "BANNED" | undefined;
        phone?: string | null | undefined;
        image?: string | undefined;
    };
}>;
//# sourceMappingURL=user.validation.d.ts.map