import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = StatusCodes.BAD_REQUEST
  ) {
    super(message);
  }
}

export const errors = {
  unauthorized: (message = "Authentication required") =>
    new AppError("UNAUTHORIZED", message, StatusCodes.UNAUTHORIZED),
  forbidden: (message = "You do not have access to this resource") =>
    new AppError("FORBIDDEN", message, StatusCodes.FORBIDDEN),
  notFound: (code: string, message: string) => new AppError(code, message, StatusCodes.NOT_FOUND),
  conflict: (code: string, message: string) => new AppError(code, message, StatusCodes.CONFLICT),
  validation: (message = "Invalid request") => new AppError("VALIDATION_ERROR", message, StatusCodes.BAD_REQUEST)
};
