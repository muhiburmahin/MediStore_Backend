import express from "express";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import validateRequest from "../../middleware/validateRequest";
import { reviewController } from "./review.controller";
import {
  createReviewValidation,
  reviewMedicineIdParamValidation,
  reviewAvgIdParamValidation,
} from "./review.validation";

const router = express.Router();

router.get(
  "/avg/:id",
  validateRequest(reviewAvgIdParamValidation),
  reviewController.getSingleMedicineWithAverageRating
);
router.get(
  "/:medicineId",
  validateRequest(reviewMedicineIdParamValidation),
  reviewController.getMedicineReviews
);

router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(createReviewValidation),
  reviewController.createReview
);

export const reviewRoutes = router;
