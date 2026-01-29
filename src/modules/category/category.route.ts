import express from "express";
import { categoryController } from "./category.controller";
const route = express.Router();

route.post("/", categoryController.createCategory);

route.get("/", categoryController.getAllCategories);

route.delete("/:id", categoryController.deleteCategoryById);

export const categoryRoute = route;