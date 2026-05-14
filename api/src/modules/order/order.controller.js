import { orderService } from "./order.service";
import { AppError } from "../../middleware/appError";
const createOrder = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new AppError("Unauthorized", 401);
        const result = await orderService.createOrder(userId, req.body);
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const getOrders = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        const path = req.originalUrl;
        if (!userId)
            throw new AppError("Unauthorized", 401);
        let result;
        if (userRole === "ADMIN") {
            result = await orderService.getAllOrders();
        }
        else if (path.includes("seller") && userRole === "SELLER") {
            result = await orderService.getSellerOrders(userId);
        }
        else {
            result = await orderService.getMyOrders(userId);
        }
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const getSingleOrderById = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const viewer = req.user ? { id: req.user.id, role: req.user.role } : undefined;
        const result = await orderService.getSingleOrderById(orderId, viewer);
        res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        const result = await orderService.updateOrderStatus(id, status, userId, userRole);
        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const deleteOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await orderService.deleteOrderById(id);
        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
export const orderController = {
    createOrder,
    getOrders,
    getSingleOrderById,
    updateStatus,
    deleteOrderById,
};
//# sourceMappingURL=order.controller.js.map