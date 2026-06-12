import { Request, Response } from "express";
import { SiteModel } from "../models/site.model";
import { ArtisanModel } from "../models/artisan.model";
import { EventModel } from "../models/event.model";
import { sendSuccess, sendError } from "../utils/response.util";

// GET /search?q=query&type=all&city=kathmandu
export const globalSearch = async (req: Request, res: Response) => {
  try {
    const { q, type = "all", city, limit = 10 } = req.query;

    if (!q || (q as string).trim().length < 2) {
      return sendError(res, "Query must be at least 2 characters", 400);
    }

    const searchTerm = q as string;
    const regex = { $regex: searchTerm, $options: "i" };
    const baseFilter = { isActive: true };

    // Add city filter if provided
    const cityFilter = city
      ? { city: { $regex: city as string, $options: "i" } }
      : {};

    let results: any = {};

    if (type === "all" || type === "sites") {
      results.sites = await SiteModel.find({
        ...baseFilter,
        ...cityFilter,
        $or: [
          { name: regex },
          { location: regex },
          { type: regex },
          { summary: regex },
          { city: regex },
        ],
      })
        .limit(Number(limit))
        .sort({ rating: -1 });
    }

    if (type === "all" || type === "artisans") {
      results.artisans = await ArtisanModel.find({
        ...baseFilter,
        ...cityFilter,
        $or: [
          { name: regex },
          { craft: regex },
          { location: regex },
          { bio: regex },
          { city: regex },
        ],
      })
        .limit(Number(limit))
        .sort({ rating: -1 });
    }

    if (type === "all" || type === "events") {
      results.events = await EventModel.find({
        ...baseFilter,
        ...cityFilter,
        $or: [
          { title: regex },
          { location: regex },
          { type: regex },
          { description: regex },
          { city: regex },
        ],
      })
        .limit(Number(limit))
        .sort({ fullDate: 1 });
    }

    return sendSuccess(res, results);
  } catch (err) {
    console.error(err);
    return sendError(res, "Search failed", 500);
  }
};

// GET /search/suggestions?q=query
export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || (q as string).trim().length < 2) {
      return sendSuccess(res, { suggestions: [] });
    }

    const searchTerm = q as string;
    const regex = { $regex: searchTerm, $options: "i" };

    const [sites, artisans, events] = await Promise.all([
      SiteModel.find({ isActive: true, name: regex })
        .limit(Number(limit))
        .select("name type city"),
      ArtisanModel.find({ isActive: true, name: regex })
        .limit(Number(limit))
        .select("name craft city"),
      EventModel.find({ isActive: true, title: regex })
        .limit(Number(limit))
        .select("title type city"),
    ]);

    const suggestions = [
      ...sites.map((s) => ({
        type: "site",
        name: s.name,
        location: s.city,
        id: s._id,
      })),
      ...artisans.map((a) => ({
        type: "artisan",
        name: a.name,
        craft: a.craft,
        id: a._id,
      })),
      ...events.map((e) => ({
        type: "event",
        name: e.title,
        location: e.city,
        id: e._id,
      })),
    ];

    return sendSuccess(res, { suggestions });
  } catch (err) {
    return sendError(res, "Failed to get suggestions", 500);
  }
};
