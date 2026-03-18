import { medicineService } from "./medicien.service";
import { AppError } from "../../middleware/appError";
const pick = (query, fields) => {
    const finalCriteria = {};
    fields.forEach((field) => {
        if (query && Object.hasOwnProperty.call(query, field)) {
            finalCriteria[field] = query[field];
        }
    });
    return finalCriteria;
};
const createMedicine = async (req, res, next) => {
    try {
        const medicineData = req.body;
        const loggedInUser = req.user;
        if (!loggedInUser || !loggedInUser.id) {
            throw new AppError("Authentication failed! Please login to your seller account.", 401);
        }
        const payloadWithSeller = {
            ...medicineData,
            sellerId: loggedInUser.id,
        };
        const result = await medicineService.createMedicine(payloadWithSeller);
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "New medicine has been listed successfully in the pharmacy inventory!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const getAllMedicines = async (req, res, next) => {
    try {
        const filters = pick(req.query, ['search', 'categoryId', 'sellerId']);
        const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
        if (req.user && req.user.role === 'SELLER' && req.query.dashboard === 'true') {
            filters.sellerId = req.user.id;
        }
        const result = await medicineService.getAllMedicines(filters, options);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "All medicine records retrieved successfully from the database.",
            meta: result.meta,
            data: result.data
        });
    }
    catch (error) {
        next(error);
    }
};
const getMedicineById = async (req, res, next) => {
    try {
        const targetMedicineId = req.params.id;
        const result = await medicineService.getMedicineById(targetMedicineId);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Medicine details fetched successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const updateMedicineById = async (req, res, next) => {
    try {
        const medicineId = req.params.id;
        const currentUserId = req.user.id;
        const currentUserRole = req.user.role;
        const updatedInfo = req.body;
        const result = await medicineService.updateMedicineById(medicineId, currentUserId, currentUserRole, updatedInfo);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Medicine record updated successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const deleteMedicineById = async (req, res, next) => {
    try {
        const medicineId = req.params.id;
        const currentUserId = req.user.id;
        const currentUserRole = req.user.role;
        await medicineService.deleteMedicineById(medicineId, currentUserId, currentUserRole);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Medicine has been permanently removed from the system inventory."
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * সব কন্ট্রোলার মেথড একটি অবজেক্ট হিসেবে এক্সপোর্ট করা হচ্ছে।
 */
export const medicineController = {
    createMedicine,
    getAllMedicines,
    getMedicineById,
    updateMedicineById,
    deleteMedicineById,
};
//# sourceMappingURL=medicien.controller.js.map