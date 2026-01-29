import express from "express";
import auth from "../../middleware/atth";
import { Role } from "../../../generated/prisma/enums";
import { medicineController } from "./medicien.controller";
const route = express.Router();

route.get("/", medicineController.getAllMedicines);
route.get("/:id", medicineController.getMedicineById);

route.post("/", auth(Role.SELLER), medicineController.createMedicine);


route.patch("/:id", auth(Role.SELLER), medicineController.updateMedicineById);

route.delete("/:id", auth(Role.SELLER), medicineController.deleteMedicineById);


export const medicineRoute = route;