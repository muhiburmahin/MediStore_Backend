import { Request, Response, NextFunction } from "express";
export declare const reviewController: {
    createReview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMedicineReviews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSingleMedicineWithAverageRating: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=review.controller.d.ts.map