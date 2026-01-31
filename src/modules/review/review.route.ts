import express from "express";
import auth from "../../middleware/atth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";
const router = express.Router();

router.get("/:medicineId", reviewController.getMedicineReviews);
router.get("/avg/:id", reviewController.getSingleMedicineWithAverageRating);

router.post("/", auth(Role.CUSTOMER), reviewController.createReview);

export const reviewRoutes = router;