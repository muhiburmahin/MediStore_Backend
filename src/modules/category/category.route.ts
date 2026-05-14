import express from "express";
import { categoryController } from "./category.controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import validateRequest from "../../middleware/validateRequest";
import {
  createCategoryValidation,
  categoryIdParamValidation,
} from "./category.validation";

const route = express.Router();

route.get("/", categoryController.getAllCategories);

route.post(
  "/",
  auth(Role.ADMIN, Role.SELLER),
  validateRequest(createCategoryValidation),
  categoryController.createCategory
);

route.delete(
  "/:id",
  auth(Role.ADMIN, Role.SELLER),
  validateRequest(categoryIdParamValidation),
  categoryController.deleteCategoryById
);

export const categoryRoute = route;
