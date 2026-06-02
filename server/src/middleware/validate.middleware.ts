import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { sendError } from "../utils/response.util";

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        sendError(res, "Validation failed", 400, errors);
        return;
      }

      next(error);
    }
  };
