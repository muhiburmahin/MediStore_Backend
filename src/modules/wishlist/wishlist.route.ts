import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../generated/prisma/client";
import validateRequest from "../../middleware/validateRequest";
import { wishlistController } from "./wishlist.controller";
import {
  wishlistAddSchema,
  wishlistToggleSchema,
  wishlistMedicineIdParamValidation,
  wishlistEntryIdParamValidation,
} from "./wishlist.validation";

const router = express.Router();

router.use(auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN));

router.get("/", wishlistController.list);
router.post("/", validateRequest(wishlistAddSchema), wishlistController.add);
router.post("/toggle", validateRequest(wishlistToggleSchema), wishlistController.toggle);
router.delete(
  "/medicine/:medicineId",
  validateRequest(wishlistMedicineIdParamValidation),
  wishlistController.removeMedicine
);
router.delete("/:id", validateRequest(wishlistEntryIdParamValidation), wishlistController.removeById);

export const wishlistRoutes = router;
