import { z } from "zod/v3";
export const notificationListQueryValidation = z.object({
    query: z.object({
        unread: z.enum(["true", "false"]).optional(),
    }),
});
export const notificationIdParamValidation = z.object({
    params: z.object({
        id: z.string().min(1, "Notification id is required"),
    }),
});
//# sourceMappingURL=notification.validation.js.map