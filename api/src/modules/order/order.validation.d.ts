import { z } from "zod/v3";
export declare const createOrderValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            medicineId: z.ZodString;
            quantity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            medicineId: string;
            quantity: number;
        }, {
            medicineId: string;
            quantity: number;
        }>, "many">;
        shippingAddress: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        paymentMethod: z.ZodEnum<["STRIPE", "COD"]>;
    }, "strip", z.ZodTypeAny, {
        paymentMethod: "STRIPE" | "COD";
        shippingAddress: string;
        items: {
            medicineId: string;
            quantity: number;
        }[];
        phone?: string | undefined;
    }, {
        paymentMethod: "STRIPE" | "COD";
        shippingAddress: string;
        items: {
            medicineId: string;
            quantity: number;
        }[];
        phone?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        paymentMethod: "STRIPE" | "COD";
        shippingAddress: string;
        items: {
            medicineId: string;
            quantity: number;
        }[];
        phone?: string | undefined;
    };
}, {
    body: {
        paymentMethod: "STRIPE" | "COD";
        shippingAddress: string;
        items: {
            medicineId: string;
            quantity: number;
        }[];
        phone?: string | undefined;
    };
}>;
export declare const updateOrderStatusValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        status: z.ZodEnum<["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]>;
    }, "strip", z.ZodTypeAny, {
        status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    }, {
        status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    };
}, {
    params: {
        id: string;
    };
    body: {
        status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    };
}>;
export declare const orderIdParamValidation: z.ZodObject<{
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
//# sourceMappingURL=order.validation.d.ts.map