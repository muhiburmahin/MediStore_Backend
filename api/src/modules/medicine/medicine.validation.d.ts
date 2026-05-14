import { z } from "zod/v3";
export declare const createMedicineValidation: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        price: z.ZodNumber;
        stock: z.ZodNumber;
        manufacturer: z.ZodString;
        images: z.ZodOptional<z.ZodAny>;
        categoryId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        price: number;
        stock: number;
        manufacturer: string;
        categoryId: string;
        images?: any;
    }, {
        name: string;
        description: string;
        price: number;
        stock: number;
        manufacturer: string;
        categoryId: string;
        images?: any;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        description: string;
        price: number;
        stock: number;
        manufacturer: string;
        categoryId: string;
        images?: any;
    };
}, {
    body: {
        name: string;
        description: string;
        price: number;
        stock: number;
        manufacturer: string;
        categoryId: string;
        images?: any;
    };
}>;
export declare const updateMedicineValidation: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
        stock: z.ZodOptional<z.ZodNumber>;
        manufacturer: z.ZodOptional<z.ZodString>;
        images: z.ZodOptional<z.ZodAny>;
        categoryId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        description?: string | undefined;
        price?: number | undefined;
        stock?: number | undefined;
        manufacturer?: string | undefined;
        images?: any;
        categoryId?: string | undefined;
    }, {
        name?: string | undefined;
        description?: string | undefined;
        price?: number | undefined;
        stock?: number | undefined;
        manufacturer?: string | undefined;
        images?: any;
        categoryId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name?: string | undefined;
        description?: string | undefined;
        price?: number | undefined;
        stock?: number | undefined;
        manufacturer?: string | undefined;
        images?: any;
        categoryId?: string | undefined;
    };
}, {
    body: {
        name?: string | undefined;
        description?: string | undefined;
        price?: number | undefined;
        stock?: number | undefined;
        manufacturer?: string | undefined;
        images?: any;
        categoryId?: string | undefined;
    };
}>;
export declare const medicineListQueryValidation: z.ZodObject<{
    query: z.ZodObject<{
        search: z.ZodOptional<z.ZodString>;
        categoryId: z.ZodOptional<z.ZodString>;
        sellerId: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodOptional<z.ZodNumber>;
        sortBy: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodString>;
        dashboard: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    }, "strip", z.ZodTypeAny, {
        search?: string | undefined;
        category?: string | undefined;
        categoryId?: string | undefined;
        sellerId?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        sortBy?: string | undefined;
        sortOrder?: string | undefined;
        dashboard?: "true" | "false" | undefined;
    }, {
        search?: string | undefined;
        category?: string | undefined;
        categoryId?: string | undefined;
        sellerId?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        sortBy?: string | undefined;
        sortOrder?: string | undefined;
        dashboard?: "true" | "false" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        search?: string | undefined;
        category?: string | undefined;
        categoryId?: string | undefined;
        sellerId?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        sortBy?: string | undefined;
        sortOrder?: string | undefined;
        dashboard?: "true" | "false" | undefined;
    };
}, {
    query: {
        search?: string | undefined;
        category?: string | undefined;
        categoryId?: string | undefined;
        sellerId?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        sortBy?: string | undefined;
        sortOrder?: string | undefined;
        dashboard?: "true" | "false" | undefined;
    };
}>;
export declare const medicineIdParamValidation: z.ZodObject<{
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
export declare const updateMedicineWithParamsValidation: z.ZodIntersection<z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
        stock: z.ZodOptional<z.ZodNumber>;
        manufacturer: z.ZodOptional<z.ZodString>;
        images: z.ZodOptional<z.ZodAny>;
        categoryId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        description?: string | undefined;
        price?: number | undefined;
        stock?: number | undefined;
        manufacturer?: string | undefined;
        images?: any;
        categoryId?: string | undefined;
    }, {
        name?: string | undefined;
        description?: string | undefined;
        price?: number | undefined;
        stock?: number | undefined;
        manufacturer?: string | undefined;
        images?: any;
        categoryId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name?: string | undefined;
        description?: string | undefined;
        price?: number | undefined;
        stock?: number | undefined;
        manufacturer?: string | undefined;
        images?: any;
        categoryId?: string | undefined;
    };
}, {
    body: {
        name?: string | undefined;
        description?: string | undefined;
        price?: number | undefined;
        stock?: number | undefined;
        manufacturer?: string | undefined;
        images?: any;
        categoryId?: string | undefined;
    };
}>, z.ZodObject<{
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
}>>;
//# sourceMappingURL=medicine.validation.d.ts.map