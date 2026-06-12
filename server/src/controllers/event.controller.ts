import { Request, Response } from "express";
import mongoose from "mongoose";
import { EventModel } from "../models/event.model";
import { sendSuccess, sendError } from "../utils/response.util";

// GET /events
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const {
      city,
      type,
      search,
      upcoming,
      month,
      page = 1,
      limit = 20,
    } = req.query;

    const filter: Record<string, unknown> = { isActive: true };

    if (city && typeof city === "string")
      filter.city = { $regex: city, $options: "i" };
    if (type && typeof type === "string")
      filter.type = { $regex: type, $options: "i" };
    if (upcoming === "true") filter.fullDate = { $gte: new Date() };
    if (month && typeof month === "string")
      filter.month = { $regex: month, $options: "i" };
    if (search && typeof search === "string")
      filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [events, total] = await Promise.all([
      EventModel.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ fullDate: 1 }),
      EventModel.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      events,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error(err);
    return sendError(res, "Failed to fetch events", 500);
  }
};

// GET /events/:id
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return sendError(res, "Invalid event ID", 400);

    const event = await EventModel.findById(id);
    if (!event) return sendError(res, "Event not found", 404);

    return sendSuccess(res, event);
  } catch (err) {
    return sendError(res, "Failed to fetch event", 500);
  }
};

// GET /events/type/:type
export const getEventsByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { limit = 10 } = req.query;

    const events = await EventModel.find({
      type: { $regex: type as string, $options: "i" },
      isActive: true,
    })
      .limit(Number(limit))
      .sort({ fullDate: 1 });

    return sendSuccess(res, events);
  } catch (err) {
    return sendError(res, "Failed to fetch events by type", 500);
  }
};

// GET /events/upcoming
export const getUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    const events = await EventModel.find({
      fullDate: { $gte: new Date() },
      isActive: true,
    })
      .limit(Number(limit))
      .sort({ fullDate: 1 });

    return sendSuccess(res, events);
  } catch (err) {
    return sendError(res, "Failed to fetch upcoming events", 500);
  }
};

// GET /events/current-month
export const getCurrentMonthEvents = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const currentMonth = now.toLocaleString("default", { month: "long" });

    const events = await EventModel.find({
      month: currentMonth,
      isActive: true,
    }).sort({ date: 1 });

    return sendSuccess(res, events);
  } catch (err) {
    return sendError(res, "Failed to fetch current month events", 500);
  }
};
