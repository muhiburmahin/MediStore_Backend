import { z } from "zod/v3";
export declare const createCategoryValidation: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        imageUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        imageUrl?: string | undefined;
    }, {
        name: string;
        imageUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        imageUrl?: string | undefined;
    };
}, {
    body: {
        name: string;
        imageUrl?: string | undefined;
    };
}>;
export declare const updateCategoryValidation: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        imageUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        imageUrl?: string | undefined;
    }, {
        name?: string | undefined;
        imageUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name?: string | undefined;
        imageUrl?: string | undefined;
    };
}, {
    body: {
        name?: string | undefined;
        imageUrl?: string | undefined;
    };
}>;
export declare const categoryIdParamValidation: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
//# sourceMappingURL=category.validation.d.ts.map