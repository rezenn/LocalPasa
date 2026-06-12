import { Response } from "express";
import mongoose from "mongoose";
import { SiteModel } from "../models/site.model";
import { ArtisanModel } from "../models/artisan.model";
import { ReviewModel } from "../models/review.model";
import { SiteArtisanModel } from "../models/siteArtisan.model";
import { sendSuccess, sendError } from "../utils/response.util";
import { AuthRequest } from "../types/user.type";

// GET /sites
export const getAllSites = async (req: AuthRequest, res: Response) => {
  try {
    const {
      city,
      type,
      search,
      hidden,
      mustVisit,
      page = 1,
      limit = 20,
      minRating,
      sortBy = "rating",
    } = req.query;

    const filter: Record<string, unknown> = { isActive: true };

    if (city && typeof city === "string")
      filter.city = { $regex: city, $options: "i" };
    if (type && typeof type === "string")
      filter.type = { $regex: type, $options: "i" };
    if (hidden === "true") filter.isHiddenGem = true;
    if (mustVisit === "true") filter.mustVisit = true;
    if (minRating && !isNaN(Number(minRating)))
      filter.rating = { $gte: Number(minRating) };
    if (search && typeof search === "string")
      filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    let sortOption: { [key: string]: 1 | -1 } = { rating: -1 };
    if (sortBy === "newest") sortOption = { createdAt: -1 };
    if (sortBy === "oldest") sortOption = { createdAt: 1 };
    if (sortBy === "name") sortOption = { name: 1 };

    const [sites, total] = await Promise.all([
      SiteModel.find(filter).skip(skip).limit(Number(limit)).sort(sortOption),
      SiteModel.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      sites,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error(err);
    return sendError(res, "Failed to fetch sites", 500);
  }
};

// GET /sites/hidden-gem
export const getHiddenGems = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    const sites = await SiteModel.find({ isHiddenGem: true, isActive: true })
      .limit(Number(limit))
      .sort({ rating: -1 });

    if (sites.length === 0) return sendError(res, "No hidden gems found", 404);
    return sendSuccess(res, sites);
  } catch (err) {
    return sendError(res, "Failed to fetch hidden gems", 500);
  }
};

// GET /sites/must-visit
export const getMustVisitSites = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    const sites = await SiteModel.find({ mustVisit: true, isActive: true })
      .limit(Number(limit))
      .sort({ rating: -1 });

    return sendSuccess(res, sites);
  } catch (err) {
    return sendError(res, "Failed to fetch must-visit sites", 500);
  }
};

// GET /sites/type/:type
export const getSitesByType = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.params;
    const { limit = 10 } = req.query;

    const sites = await SiteModel.find({
      type: { $regex: type as string, $options: "i" },
      isActive: true,
    })
      .limit(Number(limit))
      .sort({ rating: -1 });

    return sendSuccess(res, sites);
  } catch (err) {
    return sendError(res, "Failed to fetch sites by type", 500);
  }
};

// GET /sites/:id
export const getSiteById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return sendError(res, "Invalid site ID", 400);

    const site = await SiteModel.findById(id);
    if (!site) return sendError(res, "Site not found", 404);

    // Convert id to ObjectId once
    const objectId = new mongoose.Types.ObjectId(id as string);

    // Get nearby artisans via join table
    const links = await SiteArtisanModel.find({
      siteId: objectId,
    });

    // Ensure artisanIds are ObjectId types
    const artisanIds = links.map((l) => l.artisanId);
    const nearbyArtisans = await ArtisanModel.find({
      _id: { $in: artisanIds },
      isActive: true,
    });

    // Get reviews - use the same objectId
    const reviews = await ReviewModel.find({
      targetId: objectId,
      targetType: "site",
    })
      .sort({ createdAt: -1 })
      .limit(20);

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : site.rating;

    return sendSuccess(res, {
      ...site.toObject(),
      nearbyArtisans,
      reviews,
      computedRating: Number(avgRating.toFixed(1)),
      reviewCount: reviews.length,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, "Failed to fetch site", 500);
  }
};

// GET /sites/:id/quizzes
export const getSiteQuizzes = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return sendError(res, "Invalid site ID", 400);

    const site = await SiteModel.findById(id).select("quizzes name");
    if (!site) return sendError(res, "Site not found", 404);

    return sendSuccess(res, {
      siteName: site.name,
      quizzes: site.quizzes ?? [],
    });
  } catch (err) {
    return sendError(res, "Failed to fetch quizzes", 500);
  }
};

// GET /sites/:id/reviews
export const getSiteReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(id))
      return sendError(res, "Invalid site ID", 400);

    const objectId = new mongoose.Types.ObjectId(id as string);
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      ReviewModel.find({ targetId: objectId, targetType: "site" })
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      ReviewModel.countDocuments({ targetId: objectId, targetType: "site" }),
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

// POST /sites/:id/reviews (authenticated)
export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, text } = req.body;

    const user = req.currentUser!;
    const userId = user._id;
    const author = user.fullName;

    if (!mongoose.isValidObjectId(id))
      return sendError(res, "Invalid site ID", 400);
    if (!rating || rating < 1 || rating > 5)
      return sendError(res, "Rating must be between 1 and 5", 400);
    if (!text || text.trim().length < 5)
      return sendError(res, "Review text must be at least 5 characters", 400);

    const objectId = new mongoose.Types.ObjectId(id as string);

    const existing = await ReviewModel.findOne({
      userId,
      targetId: objectId,
      targetType: "site",
    });
    if (existing) return sendError(res, "You already reviewed this site", 409);

    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleString("default", { month: "short" })}`;

    const review = await ReviewModel.create({
      userId,
      targetId: objectId,
      targetType: "site",
      author,
      rating: Number(rating),
      text: text.trim(),
      date: dateStr,
    });

    // Recalculate average
    const all = await ReviewModel.find({
      targetId: objectId,
      targetType: "site",
    });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await SiteModel.findByIdAndUpdate(id, {
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
      return sendError(res, "You already reviewed this site", 409);
    }
    console.error(err);
    return sendError(res, "Failed to add review", 500);
  }
};
