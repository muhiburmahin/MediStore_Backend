import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../generated/prisma/client";
import validateRequest from "../../middleware/validateRequest";
import { medicineController } from "./medicien.controller";
import { createMedicineValidation, medicineListQueryValidation, medicineIdParamValidation, updateMedicineWithParamsValidation, } from "./medicine.validation";
const router = express.Router();
router.get("/", validateRequest(medicineListQueryValidation), medicineController.getAllMedicines);
router.get("/:id", validateRequest(medicineIdParamValidation), medicineController.getMedicineById);
router.post("/", auth(Role.SELLER, Role.ADMIN), validateRequest(createMedicineValidation), medicineController.createMedicine);
router.patch("/:id", auth(Role.SELLER, Role.ADMIN), validateRequest(updateMedicineWithParamsValidation), medicineController.updateMedicineById);
router.delete("/:id", auth(Role.SELLER, Role.ADMIN), validateRequest(medicineIdParamValidation), medicineController.deleteMedicineById);
export const medicineRoute = router;
//# sourceMappingURL=medicien.route.js.map