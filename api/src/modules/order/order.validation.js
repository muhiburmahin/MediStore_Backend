import { z } from "zod/v3";
const OrderStatusEnum = z.enum(["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]);
export const createOrderValidationSchema = z.object({
    body: z.object({
        items: z
            .array(z.object({
            medicineId: z.string().min(1, "medicineId is required"),
            quantity: z.coerce.number().int().positive(),
        }))
            .min(1, "At least one item is required"),
        shippingAddress: z.string().min(1, "Shipping address is required"),
        phone: z.string().optional(),
        paymentMethod: z.enum(["STRIPE", "COD"]),
    }),
});
export const updateOrderStatusValidationSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Order id is required"),
    }),
    body: z.object({
        status: OrderStatusEnum,
    }),
});
export const orderIdParamValidation = z.object({
    params: z.object({
        id: z.string().min(1, "Order id is required"),
    }),
});
//# sourceMappingURL=order.validation.js.map