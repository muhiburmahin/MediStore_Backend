import { userService } from "./user.service";
import { AppError } from "../../middleware/appError";
const getMyProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await userService.getMyProfile(userId);
        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const getAllUsers = async (req, res, next) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "All users retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const adminStats = async (req, res, next) => {
    try {
        const result = await userService.adminStats();
        res.status(200).json({
            success: true,
            message: "Overall platform stats fetched successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const sellerStats = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        const result = await userService.sellerStats(sellerId);
        res.status(200).json({
            success: true,
            message: "Your sales and product stats fetched successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const customerStats = async (req, res, next) => {
    try {
        const customerId = req.user.id;
        const result = await userService.customerStats(customerId);
        res.status(200).json({
            success: true,
            message: "Your personal order summary fetched successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const updateProfile = async (req, res, next) => {
    try {
        const targetId = req.params.id || req.user.id;
        const userRole = req.user.role;
        if (userRole !== 'ADMIN') {
            delete req.body.role;
            delete req.body.email;
            if (req.params.id && req.params.id !== req.user.id) {
                throw new AppError("Forbidden! You can only update your own profile.", 403);
            }
        }
        const result = await userService.updateProfile(targetId, req.body);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
export const userController = {
    getMyProfile,
    getAllUsers,
    adminStats,
    sellerStats,
    customerStats,
    updateProfile
};
//# sourceMappingURL=user.controller.js.map