import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../generated/prisma/client";
import validateRequest from "../../middleware/validateRequest";
import { userController } from "./user.controller";
import { patchUserProfileValidation } from "./user.validation";

const router = express.Router();

router.get("/user/me", auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), userController.getMyProfile);

router.get("/customer/stats", auth(Role.CUSTOMER), userController.customerStats);

router.patch(
  "/user/update/:id",
  auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
  validateRequest(patchUserProfileValidation),
  userController.updateProfile
);

export const userRoutes = router;
