import { Request, Response, NextFunction } from "express";
import { reviewService } from "./review.service";

const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const result = await reviewService.createReview(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Review added successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};

const getMedicineReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { medicineId } = req.params;
        const result = await reviewService.getMedicineReviews(medicineId as string);

        res.status(200).json({
            success: true,
            message: "Reviews retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};

export const reviewController = {
    createReview,
    getMedicineReviews
};