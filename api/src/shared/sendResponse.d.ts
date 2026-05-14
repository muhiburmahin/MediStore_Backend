import { Response } from "express";
type SendPayload<T> = {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
};
declare const sendResponse: <T>(res: Response, payload: SendPayload<T>) => void;
export default sendResponse;
//# sourceMappingURL=sendResponse.d.ts.map