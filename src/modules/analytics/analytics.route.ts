import express from "express";
import auth from "../../middleware/atth";
import { Role } from "../../../generated/prisma/enums";
import { analyticsController } from "./analytics.controller";
const router = express.Router();

router.get(
    "/",
    auth(Role.ADMIN, Role.SELLER),
    analyticsController.getStats
);

export const analyticsRoutes = router;