import { z } from "zod/v3";
export declare const createReviewValidation: z.ZodObject<{
    body: z.ZodObject<{
        comment: z.ZodOptional<z.ZodString>;
        rating: z.ZodNumber;
        medicineId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        medicineId: string;
        rating: number;
        comment?: string | undefined;
    }, {
        medicineId: string;
        rating: number;
        comment?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        medicineId: string;
        rating: number;
        comment?: string | undefined;
    };
}, {
    body: {
        medicineId: string;
        rating: number;
        comment?: string | undefined;
    };
}>;
export declare const updateReviewValidation: z.ZodObject<{
    body: z.ZodObject<{
        comment: z.ZodOptional<z.ZodString>;
        rating: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        rating?: number | undefined;
        comment?: string | undefined;
    }, {
        rating?: number | undefined;
        comment?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        rating?: number | undefined;
        comment?: string | undefined;
    };
}, {
    body: {
        rating?: number | undefined;
        comment?: string | undefined;
    };
}>;
export declare const reviewMedicineIdParamValidation: z.ZodObject<{
    params: z.ZodObject<{
        medicineId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        medicineId: string;
    }, {
        medicineId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        medicineId: string;
    };
}, {
    params: {
        medicineId: string;
    };
}>;
export declare const reviewAvgIdParamValidation: z.ZodObject<{
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
//# sourceMappingURL=review.validation.d.ts.map