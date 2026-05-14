import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../generated/prisma/client";
import validateRequest from "../../middleware/validateRequest";
import { notificationController } from "./notification.controller";
import {
  notificationListQueryValidation,
  notificationIdParamValidation,
} from "./notification.validation";

const router = express.Router();

router.use(auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN));

router.get("/", validateRequest(notificationListQueryValidation), notificationController.list);
router.patch("/read-all", notificationController.markAllRead);
router.patch(
  "/:id/read",
  validateRequest(notificationIdParamValidation),
  notificationController.markRead
);

export const notificationRoutes = router;
