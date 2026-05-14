import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../generated/prisma/client";
import validateRequest from "../../middleware/validateRequest";
import { orderController } from "./order.controller";
import { createOrderValidationSchema, updateOrderStatusValidationSchema, orderIdParamValidation, } from "./order.validation";
const router = express.Router();
router.get("/", auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN), orderController.getOrders);
router.get("/:id", auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN), validateRequest(orderIdParamValidation), orderController.getSingleOrderById);
router.post("/", auth(Role.CUSTOMER, Role.SELLER), validateRequest(createOrderValidationSchema), orderController.createOrder);
router.patch("/update-status/:id", auth(Role.SELLER, Role.ADMIN), validateRequest(updateOrderStatusValidationSchema), orderController.updateStatus);
router.delete("/:id", auth(Role.ADMIN, Role.SELLER), validateRequest(orderIdParamValidation), orderController.deleteOrderById);
export const orderRoutes = router;
//# sourceMappingURL=order.route.js.map