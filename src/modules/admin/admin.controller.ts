import { Request, Response, NextFunction } from "express";
import { adminAnalyticsService } from "./admin.service";

const getDashboardAnalytics = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await adminAnalyticsService.getDashboard();
    res.status(200).json({
      success: true,
      message: "Admin dashboard analytics",
      data,
    });
  } catch (e) {
    next(e);
  }
};

export const adminController = {
  getDashboardAnalytics,
};
