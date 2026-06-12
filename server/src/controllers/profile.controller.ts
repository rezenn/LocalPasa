import { Response } from "express";
import { SavedModel } from "../models/saved.model";
import { sendSuccess, sendError } from "../utils/response.util";
import { AuthRequest } from "../types/user.type";

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
