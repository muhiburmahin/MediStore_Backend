import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicien.service";
import { AppError } from "../../middleware/appError";

const createMedicine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const medicineData = req.body;
        const sellerId = req.user?.id;
        if (!sellerId) {
            throw new AppError("You must be logged in to add medicine", 401);
        }
        const result = await medicineService.createMedicine({
            ...medicineData, sellerId
        });
        res.status(201).json({
            success: true,
            message: "Medicine created!",
            data: result
        });
    }
    catch (error: any) {
        next(error);
    }
};


const getAllMedicines = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await medicineService.getAllMedicines();
        res.status(200).json({
            success: true,
            message: "Medicines get successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};

const getMedicineById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await medicineService.getMedicineById(req.params.id as string);
        res.status(200).json({
            success: true,
            message: "Medicines get successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};

const updateMedicineById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await medicineService.updateMedicineById(req.params.id as string, req.user!.id, req.body);
        res.status(200).json({
            success: true,
            message: "Medicine updated!",
            data: result
        });
    } catch (error) {
        next(error);
    }
};



const deleteMedicineById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await medicineService.deleteMedicineById(req.params.id as string, req.user!.id);
        res.status(200).json({
            success: true,
            message: "Medicine deleted successfully!"
        });
    }
    catch (error) {
        next(error);
    }
};

export const medicineController = {
    createMedicine,
    getAllMedicines,
    getMedicineById,
    updateMedicineById,
    deleteMedicineById,
};