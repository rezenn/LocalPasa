import { Request, Response } from "express";
import { SiteModel } from "../models/site.model";
import { ArtisanModel } from "../models/artisan.model";
import { EventModel } from "../models/event.model";
import { ReviewModel } from "../models/review.model";
import { UserModel } from "../models/user.model";
import { sendSuccess, sendError } from "../utils/response.util";

// GET /dashboard/stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalSites,
      totalArtisans,
      totalEvents,
      totalReviews,
      totalUsers,
      avgSiteRating,
      avgArtisanRating,
    ] = await Promise.all([
      SiteModel.countDocuments({ isActive: true }),
      ArtisanModel.countDocuments({ isActive: true }),
      EventModel.countDocuments({ isActive: true }),
      ReviewModel.countDocuments(),
      // Fix: Use simple object syntax instead of $eq
      UserModel.countDocuments({ role: "tourist" as any }),
      SiteModel.aggregate([
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]),
      ArtisanModel.aggregate([
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]),
    ]);

    return sendSuccess(res, {
      totalSites,
      totalArtisans,
      totalEvents,
      totalReviews,
      totalUsers,
      avgSiteRating: avgSiteRating[0]?.avg || 0,
      avgArtisanRating: avgArtisanRating[0]?.avg || 0,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, "Failed to fetch dashboard stats", 500);
  }
};

// GET /dashboard/top-rated
export const getTopRated = async (req: Request, res: Response) => {
  try {
    const { limit = 5 } = req.query;
    const limitNum = Number(limit);

    const [topSites, topArtisans] = await Promise.all([
      SiteModel.find({ isActive: true })
        .sort({ rating: -1, ratingCount: -1 })
        .limit(limitNum)
        .select("name type city rating ratingCount image"),
      ArtisanModel.find({ isActive: true })
        .sort({ rating: -1, ratingCount: -1 })
        .limit(limitNum)
        .select("name craft city rating ratingCount image"),
    ]);

    return sendSuccess(res, { topSites, topArtisans });
  } catch (err) {
    console.error(err);
    return sendError(res, "Failed to fetch top rated", 500);
  }
};
