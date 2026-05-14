import { reviewService } from "./review.service";
const createReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
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
const getMedicineReviews = async (req, res, next) => {
    try {
        const { medicineId } = req.params;
        const result = await reviewService.getMedicineReviews(medicineId);
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
const getSingleMedicineWithAverageRating = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await reviewService.getSingleMedicineWithAverageRating(id);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found!",
            });
        }
        res.status(200).json({
            success: true,
            message: "Medicine details retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
export const reviewController = {
    createReview,
    getMedicineReviews,
    getSingleMedicineWithAverageRating
};
//# sourceMappingURL=review.controller.js.map