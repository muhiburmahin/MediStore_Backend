import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { medicineController } from "./medicien.controller";
const router = express.Router();
router.get("/", medicineController.getAllMedicines);
router.get("/:id", medicineController.getMedicineById);
router.post("/", auth(Role.SELLER, Role.ADMIN), medicineController.createMedicine);
router.patch("/:id", auth(Role.SELLER, Role.ADMIN), medicineController.updateMedicineById);
router.delete("/:id", auth(Role.SELLER, Role.ADMIN), medicineController.deleteMedicineById);
export const medicineRoute = router;
//# sourceMappingURL=medicien.route.js.map