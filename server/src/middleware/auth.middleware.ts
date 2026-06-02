import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/user.type";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/response.util";
import { verifyAccessToken } from "../utils/token.util";

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const payload = verifyAccessToken(token);
    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new AppError("User not found", 401);
    }

    req.currentUser = user;
    req.tokenPayload = payload;
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError("Invalid token", 401));
  }
};
