import { NextFunction, Request, Response } from "express";
import { AppError, sendError } from "../utils/response.util";
import { logger } from "../utils/logger.util";
import { config } from "../configs/env";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message =
    error instanceof AppError || config.isDev
      ? error.message
      : "Internal server error";

  if (!(error instanceof AppError) || statusCode >= 500) {
    logger.error(error);
  }

  return sendError(
    res,
    message,
    statusCode,
    error instanceof AppError ? error.errors : undefined,
  );
};
