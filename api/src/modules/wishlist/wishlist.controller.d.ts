import { Request, Response, NextFunction } from "express";
export declare const wishlistController: {
    list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    add: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    removeMedicine: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    removeById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    toggle: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=wishlist.controller.d.ts.map