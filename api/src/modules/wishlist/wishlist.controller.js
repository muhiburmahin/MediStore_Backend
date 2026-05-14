import { wishlistService } from "./wishlist.service";
import { AppError } from "../../middleware/appError";
const list = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = await wishlistService.listForUser(userId);
        res.status(200).json({ success: true, message: "Wishlist fetched", data });
    }
    catch (e) {
        next(e);
    }
};
const add = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { medicineId } = req.body;
        const data = await wishlistService.add(userId, medicineId);
        res.status(201).json({ success: true, message: "Added to wishlist", data });
    }
    catch (e) {
        next(e);
    }
};
const removeMedicine = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { medicineId } = req.params;
        const data = await wishlistService.removeByMedicineId(userId, medicineId);
        res.status(200).json({ success: true, message: "Removed from wishlist", data });
    }
    catch (e) {
        next(e);
    }
};
const removeById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const data = await wishlistService.removeById(userId, id);
        res.status(200).json({ success: true, message: "Removed from wishlist", data });
    }
    catch (e) {
        next(e);
    }
};
const toggle = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { medicineId } = req.body;
        if (!medicineId)
            throw new AppError("medicineId is required", 400);
        const data = await wishlistService.toggle(userId, medicineId);
        res.status(200).json({ success: true, message: "Wishlist updated", data });
    }
    catch (e) {
        next(e);
    }
};
export const wishlistController = {
    list,
    add,
    removeMedicine,
    removeById,
    toggle,
};
//# sourceMappingURL=wishlist.controller.js.map