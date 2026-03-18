import express from "express";
import auth from "../../middleware/auth";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/user/me", auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), userController.getMyProfile);

router.get("/admin/users", auth(Role.ADMIN), userController.getAllUsers);

router.get("/admin/stats", auth(Role.ADMIN), userController.adminStats);
router.get("/seller/stats", auth(Role.SELLER), userController.sellerStats);
router.get("/customer/stats", auth(Role.CUSTOMER), userController.customerStats);

router.patch("/user/update/:id", auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN), userController.updateProfile);

router.patch("/admin/users/:id", auth(Role.ADMIN), userController.updateProfile);


export const userRoutes = router;