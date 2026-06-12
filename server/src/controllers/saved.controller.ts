import { Response } from "express";
import mongoose from "mongoose";
import { SavedModel } from "../models/saved.model";
import { SiteModel } from "../models/site.model";
import { ArtisanModel } from "../models/artisan.model";
import { EventModel } from "../models/event.model";
import { sendSuccess, sendError } from "../utils/response.util";
import { AuthRequest } from "../types/user.type";

// GET /saved
export const getSaved = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.currentUser!._id;
    const savedItems = await SavedModel.find({ userId }).sort({
      createdAt: -1,
    });

    const siteIds = savedItems
      .filter((s) => s.itemType === "site")
      .map((s) => s.itemId);
    const artisanIds = savedItems
      .filter((s) => s.itemType === "artisan")
      .map((s) => s.itemId);
    const eventIds = savedItems
      .filter((s) => s.itemType === "event")
      .map((s) => s.itemId);

    const [sites, artisans, events] = await Promise.all([
      SiteModel.find({ _id: { $in: siteIds } }),
      ArtisanModel.find({ _id: { $in: artisanIds } }),
      EventModel.find({ _id: { $in: eventIds } }),
    ]);

    return sendSuccess(res, { sites, artisans, events });
  } catch (err) {
    console.error(err);
    return sendError(res, "Failed to fetch saved items", 500);
  }
};

// POST /saved
export const saveItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.currentUser!._id;
    const { itemId, itemType } = req.body;

    if (!mongoose.isValidObjectId(itemId))
      return sendError(res, "Invalid item ID", 400);
    if (!["site", "artisan", "event"].includes(itemType))
      return sendError(res, "Invalid item type", 400);

    const saved = await SavedModel.create({ userId, itemId, itemType });
    return sendSuccess(res, saved, "Item saved", 201);
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: number }).code === 11000
    ) {
      return sendError(res, "Item already saved", 409);
    }
    console.error(err);
    return sendError(res, "Failed to save item", 500);
  }
};

// DELETE /saved/:itemId
export const unsaveItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.currentUser!._id;
    const { itemId } = req.params;
    const { itemType } = req.query;

    // Fix: Validate and convert types properly
    if (!mongoose.isValidObjectId(itemId))
      return sendError(res, "Invalid item ID", 400);

    if (!itemType || typeof itemType !== "string")
      return sendError(res, "Item type is required", 400);

    if (!["site", "artisan", "event"].includes(itemType))
      return sendError(res, "Invalid item type", 400);

    const deleted = await SavedModel.findOneAndDelete({
      userId,
      itemId: new mongoose.Types.ObjectId(itemId as string),
      itemType: itemType as "site" | "artisan" | "event",
    });

    if (!deleted) return sendError(res, "Saved item not found", 404);

    return sendSuccess(res, null, "Item removed from saved");
  } catch (err) {
    console.error(err);
    return sendError(res, "Failed to remove item", 500);
  }
};
