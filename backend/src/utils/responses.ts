import type { Response } from "express";
import { StatusCodes } from "http-status-codes";

export function ok<T>(res: Response, data: T, status = StatusCodes.OK): Response {
  return res.status(status).json({ success: true, data });
}

export function noContent(res: Response): Response {
  return res.status(StatusCodes.NO_CONTENT).send();
}
