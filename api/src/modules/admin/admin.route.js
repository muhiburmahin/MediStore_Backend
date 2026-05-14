import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../generated/prisma/client";
import validateRequest from "../../middleware/validateRequest";
import { adminController } from "./admin.controller";
import { userController } from "../user/user.controller";
import { adminPatchUserValidation } from "../user/user.validation";
const router = express.Router();
router.use(auth(Role.ADMIN));
router.get("/analytics", adminController.getDashboardAnalytics);
router.get("/users", userController.getAllUsers);
router.get("/stats", userController.adminStats);
router.patch("/users/:id", validateRequest(adminPatchUserValidation), userController.updateProfile);
export const adminRoutes = router;
//# sourceMappingURL=admin.route.js.map