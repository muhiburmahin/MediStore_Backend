import express from "express";
import auth from "../../middleware/atth"; // তোমার ফাইলে নামের বানানে হয়তো ভুল ছিল (atth)
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

// Get won Profile
router.get("/user/me", auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), userController.getMyProfile);
//Get all users
router.get("/admin/users", auth(Role.ADMIN), userController.getAllUsers);

// Only Admin can update Profile
router.patch("/admin/users/:id", auth(Role.ADMIN), userController.updateProfile);

export const userRoutes = router;