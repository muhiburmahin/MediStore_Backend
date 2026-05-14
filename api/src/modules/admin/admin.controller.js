import { adminAnalyticsService } from "./admin.service";
const getDashboardAnalytics = async (_req, res, next) => {
    try {
        const data = await adminAnalyticsService.getDashboard();
        res.status(200).json({
            success: true,
            message: "Admin dashboard analytics",
            data,
        });
    }
    catch (e) {
        next(e);
    }
};
export const adminController = {
    getDashboardAnalytics,
};
//# sourceMappingURL=admin.controller.js.map