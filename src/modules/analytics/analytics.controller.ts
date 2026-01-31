import { Request, Response, NextFunction } from "express";
import { analyticsService } from "./analytics.service";

const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

        let result;
        if (role === 'ADMIN') {
            result = await analyticsService.getAdminStats();
        } else {
            result = await analyticsService.getSellerStats(userId!);
        }
        res.status(200).json({
            success: true,
            message: "Analytics data retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};

export const analyticsController = {
    getStats
};