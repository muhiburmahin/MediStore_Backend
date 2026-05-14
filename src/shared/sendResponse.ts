import { Response } from "express";

type SendPayload<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
};

const sendResponse = <T>(res: Response, payload: SendPayload<T>) => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data ?? null,
  });
};

export default sendResponse;
