import { NextFunction, Request, Response } from "express";
export declare const orderController: {
    createOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSingleOrderById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteOrderById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=order.controller.d.ts.map