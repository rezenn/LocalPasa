import { Response } from "express";
import mongoose from "mongoose";
import { ArtisanModel } from "../models/artisan.model";
import { ReviewModel } from "../models/review.model";
import { SiteArtisanModel } from "../models/siteArtisan.model";
import { SiteModel } from "../models/site.model";
import { sendSuccess, sendError } from "../utils/response.util";
import { AuthRequest } from "../types/user.type";

// GET /artisans
export const getAllArtisans = async (req: AuthRequest, res: Response) => {
  try {
    const {
      city,
      craft,
      search,
      page = 1,
      limit = 20,
      minRating,
      sortBy = "rating",
    } = req.query;

    const filter: Record<string, unknown> = { isActive: true };

    if (city && typeof city === "string")
      filter.city = { $regex: city, $options: "i" };
    if (craft && typeof craft === "string")
      filter.craft = { $regex: craft, $options: "i" };
    if (minRating && !isNaN(Number(minRating)))
      filter.rating = { $gte: Number(minRating) };
    if (search && typeof search === "string")
      filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    let sortOption: { [key: string]: 1 | -1 } = { rating: -1 };
    if (sortBy === "experience") sortOption = { experience: -1 };
    if (sortBy === "name") sortOption = { name: 1 };

    const [artisans, total] = await Promise.all([
      ArtisanModel.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort(sortOption),
      ArtisanModel.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      artisans,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error(err);
    return sendError(res, "Failed to fetch artisans", 500);
  }
};

// GET /artisans/craft/:craft
export const getArtisansByCraft = async (req: AuthRequest, res: Response) => {
  try {
    const { craft } = req.params;
    const { limit = 10 } = req.query;

    const artisans = await ArtisanModel.find({
      craft: { $regex: craft as string, $options: "i" },
      isActive: true,
    })
      .limit(Number(limit))
      .sort({ rating: -1 });

    return sendSuccess(res, artisans);
  } catch (err) {
    return sendError(res, "Failed to fetch artisans by craft", 500);
  }
};

// GET /artisans/:id
export const getArtisanById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return sendError(res, "Invalid artisan ID", 400);

    const artisan = await ArtisanModel.findById(id);
    if (!artisan) return sendError(res, "Artisan not found", 404);

    // Convert id to ObjectId once
    const objectId = new mongoose.Types.ObjectId(id as string);

    // Associated sites
    const links = await SiteArtisanModel.find({
      artisanId: objectId,
    });

    // Ensure siteIds are ObjectId types
    const siteIds = links.map((l) => l.siteId);
    const associatedSites = await SiteModel.find({
      _id: { $in: siteIds },
      isActive: true,
    });

    // Reviews - use the same objectId
    const reviews = await ReviewModel.find({
      targetId: objectId,
      targetType: "artisan",
    })
      .sort({ createdAt: -1 })
      .limit(20);

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : artisan.rating;

    return sendSuccess(res, {
      ...artisan.toObject(),
      associatedSites,
      reviews,
      computedRating: Number(avgRating.toFixed(1)),
      reviewCount: reviews.length,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, "Failed to fetch artisan", 500);
  }
};

// GET /artisans/:id/products
export const getArtisanProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return sendError(res, "Invalid artisan ID", 400);

    const artisan = await ArtisanModel.findById(id).select("products name");
    if (!artisan) return sendError(res, "Artisan not found", 404);

    return sendSuccess(res, {
      artisanName: artisan.name,
      products: artisan.products ?? [],
    });
  } catch (err) {
    return sendError(res, "Failed to fetch products", 500);
  }
};

// GET /artisans/:id/workshops
export const getArtisanWorkshops = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return sendError(res, "Invalid artisan ID", 400);

    const artisan = await ArtisanModel.findById(id).select("workshops name");
    if (!artisan) return sendError(res, "Artisan not found", 404);

    return sendSuccess(res, {
      artisanName: artisan.name,
      workshops: artisan.workshops ?? [],
    });
  } catch (err) {
    return sendError(res, "Failed to fetch workshops", 500);
  }
};

// GET /artisans/:id/reviews
export const getArtisanReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(id))
      return sendError(res, "Invalid artisan ID", 400);

    const objectId = new mongoose.Types.ObjectId(id as string);
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      ReviewModel.find({ targetId: objectId, targetType: "artisan" })
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      ReviewModel.countDocuments({ targetId: objectId, targetType: "artisan" }),
    ]);

    return sendSuccess(res, {
      reviews,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    return sendError(res, "Failed to fetch reviews", 500);
  }
};

// POST /artisans/:id/reviews (authenticated)
export const addArtisanReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, text } = req.body;

    const user = req.currentUser!;
    const userId = user._id;
    const author = user.fullName;

    if (!mongoose.isValidObjectId(id))
      return sendError(res, "Invalid artisan ID", 400);
    if (!rating || rating < 1 || rating > 5)
      return sendError(res, "Rating must be between 1 and 5", 400);
    if (!text || text.trim().length < 5)
      return sendError(res, "Review text must be at least 5 characters", 400);

    const objectId = new mongoose.Types.ObjectId(id as string);

    const existing = await ReviewModel.findOne({
      userId,
      targetId: objectId,
      targetType: "artisan",
    });
    if (existing)
      return sendError(res, "You already reviewed this artisan", 409);

    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleString("default", { month: "short" })}`;

    const review = await ReviewModel.create({
      userId,
      targetId: objectId,
      targetType: "artisan",
      author,
      rating: Number(rating),
      text: text.trim(),
      date: dateStr,
    });

    // Recalculate average
    const all = await ReviewModel.find({
      targetId: objectId,
      targetType: "artisan",
    });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await ArtisanModel.findByIdAndUpdate(id, {
      rating: Number(avg.toFixed(1)),
      ratingCount: all.length,
    });

    return sendSuccess(res, review, "Review added", 201);
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: number }).code === 11000
    ) {
      return sendError(res, "You already reviewed this artisan", 409);
    }
    console.error(err);
    return sendError(res, "Failed to add review", 500);
  }
};
