import { NextFunction, Request, Response } from "express";
/**
 * সব কন্ট্রোলার মেথড একটি অবজেক্ট হিসেবে এক্সপোর্ট করা হচ্ছে।
 */
export declare const medicineController: {
    createMedicine: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllMedicines: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMedicineById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateMedicineById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteMedicineById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=medicien.controller.d.ts.map