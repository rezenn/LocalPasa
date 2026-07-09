import { Response } from "express";
import { SavedModel } from "../models/saved.model";
import { sendSuccess, sendError } from "../utils/response.util";
import { AppError } from "../utils/response.util";
import { AuthRequest } from "../types/user.type";
import { userRepository } from "../repositories/user.repository";

// GET /profile/me
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.currentUser!;
    const savedCount = await SavedModel.countDocuments({ userId: user._id });

    return sendSuccess(res, {
      ...user.toPublicJSON(),
      savedCount,
      tourismPreferences: user.tourismPreferences ?? [],
      preferredLanguage: user.preferredLanguage ?? "en",
      nationality: user.nationality ?? null,
      phone: user.phone ?? null,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, "Failed to fetch profile", 500);
  }
};

// PATCH /profile/update
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.currentUser!;
    const {
      fullName,
      phone,
      nationality,
      preferredLanguage,
      tourismPreferences,
      avatar,
    } = req.body;

    if (fullName && fullName.trim().length >= 2)
      user.fullName = fullName.trim();
    if (phone !== undefined) user.phone = phone;
    if (nationality !== undefined) user.nationality = nationality;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (tourismPreferences && Array.isArray(tourismPreferences)) {
      user.tourismPreferences = tourismPreferences;
    }
    if (avatar) user.avatar = avatar;

    await user.save();
    return sendSuccess(res, user.toPublicJSON(), "Profile updated");
  } catch (err) {
    console.error(err);
    return sendError(res, "Failed to update profile", 500);
  }
};

// GET /profile/saved/stats
export const getSavedStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.currentUser!._id;

    const stats = await SavedModel.aggregate([
      { $match: { userId } },
      { $group: { _id: "$itemType", count: { $sum: 1 } } },
    ]);

    const result: Record<string, number> = {
      total: 0,
      sites: 0,
      artisans: 0,
      events: 0,
    };
    stats.forEach((s) => {
      result[s._id as string] = s.count;
      result.total += s.count;
    });

    return sendSuccess(res, result);
  } catch (err) {
    return sendError(res, "Failed to fetch saved stats", 500);
  }
};

// POST /profile/change-password
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await userRepository.findByIdWithPassword(
      req.currentUser!._id.toString(),
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const matches = await user.comparePassword(currentPassword);
    if (!matches) {
      throw new AppError("Current password is incorrect", 401);
    }

    user.password = newPassword;
    user.refreshTokens = []; // force re-login everywhere else
    await user.save();

    return sendSuccess(res, null, "Password changed successfully");
  } catch (err) {
    if (err instanceof AppError) {
      return sendError(res, err.message, err.statusCode);
    }
    console.error(err);
    return sendError(res, "Failed to change password", 500);
  }
};
