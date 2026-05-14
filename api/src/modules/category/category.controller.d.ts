import { Request, Response } from "express";
export declare const categoryController: {
    createCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllCategories: (req: Request, res: Response) => Promise<void>;
    deleteCategoryById: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=category.controller.d.ts.map