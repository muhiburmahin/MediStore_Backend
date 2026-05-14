import { z } from "zod/v3";
export declare const notificationListQueryValidation: z.ZodObject<{
    query: z.ZodObject<{
        unread: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    }, "strip", z.ZodTypeAny, {
        unread?: "true" | "false" | undefined;
    }, {
        unread?: "true" | "false" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        unread?: "true" | "false" | undefined;
    };
}, {
    query: {
        unread?: "true" | "false" | undefined;
    };
}>;
export declare const notificationIdParamValidation: z.ZodObject<{
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
//# sourceMappingURL=notification.validation.d.ts.map