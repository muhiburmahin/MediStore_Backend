import { z } from "zod/v3";
export declare const wishlistAddSchema: z.ZodObject<{
    body: z.ZodObject<{
        medicineId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        medicineId: string;
    }, {
        medicineId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        medicineId: string;
    };
}, {
    body: {
        medicineId: string;
    };
}>;
export declare const wishlistToggleSchema: z.ZodObject<{
    body: z.ZodObject<{
        medicineId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        medicineId: string;
    }, {
        medicineId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        medicineId: string;
    };
}, {
    body: {
        medicineId: string;
    };
}>;
export declare const wishlistMedicineIdParamValidation: z.ZodObject<{
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
export declare const wishlistEntryIdParamValidation: z.ZodObject<{
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
//# sourceMappingURL=wishlist.validation.d.ts.map