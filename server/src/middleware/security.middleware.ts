import { NextFunction, Request, Response } from "express";

const sanitizeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce(
      (safe, [key, child]) => {
        if (!key.startsWith("$") && !key.includes(".")) {
          safe[key] = sanitizeValue(child);
        }
        return safe;
      },
      {} as Record<string, unknown>,
    );
  }

  return value;
};

export const sanitizeBody = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  next();
};
