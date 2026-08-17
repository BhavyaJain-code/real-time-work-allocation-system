import type { ErrorRequestHandler, RequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/appError";
import { env, isProduction } from "../config/env";
import { logger } from "../config/logger";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError("ROUTE_NOT_FOUND", `Route ${req.method} ${req.path} not found`, StatusCodes.NOT_FOUND));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Invalid request", details: err.flatten() }
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message }
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const status = err.code === "P2002" ? StatusCodes.CONFLICT : StatusCodes.BAD_REQUEST;
    const code = err.code === "P2002" ? "CONFLICT" : "DATABASE_ERROR";
    return res.status(status).json({
      success: false,
      error: { code, message: "Database request failed" }
    });
  }

  logger.error({ err, env: env.NODE_ENV }, "Unhandled request error");
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: isProduction ? "Unexpected server error" : err instanceof Error ? err.message : "Unexpected server error"
    }
  });
};
