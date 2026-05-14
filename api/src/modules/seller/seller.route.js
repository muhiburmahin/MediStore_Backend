import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../generated/prisma/client";
import { userController } from "../user/user.controller";
import { medicineRoute } from "../medicine/medicien.route";
import { orderRoutes } from "../order/order.route";
const router = express.Router();
router.use(auth(Role.SELLER, Role.ADMIN));
router.get("/stats", userController.sellerStats);
router.use("/medicines", medicineRoute);
router.use("/orders", orderRoutes);
export const sellerRoutes = router;
//# sourceMappingURL=seller.route.js.map