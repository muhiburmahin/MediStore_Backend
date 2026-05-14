import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod/v3";
declare const validateRequest: (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default validateRequest;
//# sourceMappingURL=validateRequest.d.ts.map