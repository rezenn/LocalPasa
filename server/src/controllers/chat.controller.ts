import { Request, Response } from "express";
import mongoose from "mongoose";
import { ChatModel } from "../models/chat.model";
import { sendSuccess, sendError } from "../utils/response.util";
import { verifyAccessToken } from "../utils/token.util";

// POST /chat/send
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const rawId = req.body.artisanId as string | string[] | undefined;
    const artisanId: string | undefined = Array.isArray(rawId)
      ? rawId[0]
      : typeof rawId === "string"
        ? rawId
        : undefined;
    const { text } = req.body;
    if (
      !artisanId ||
      !text ||
      typeof text !== "string" ||
      text.trim().length === 0
    )
      return sendError(res, "artisanId and text are required", 400);

    let userId: mongoose.Types.ObjectId | undefined;
    let authorName: string | undefined;

    try {
      const header = req.headers.authorization;
      const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
      if (token) {
        const payload = verifyAccessToken(token);
        userId = new mongoose.Types.ObjectId(payload.userId);
        authorName = payload.email ?? undefined;
      }
    } catch {
      // ignore invalid token — allow anonymous messages
    }

    const doc = await ChatModel.create({
      artisanId: new mongoose.Types.ObjectId(artisanId),
      userId: userId ?? null,
      authorName: authorName ?? undefined,
      text: text.trim(),
    });

    return sendSuccess(res, doc, "Message stored", 201);
  } catch (err) {
    console.error(err);
    return sendError(res, "Failed to send message", 500);
  }
};

// GET /chat/:artisanId
export const getMessages = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.artisanId;
    const artisanId = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!artisanId || !mongoose.isValidObjectId(artisanId))
      return sendError(res, "Invalid artisan ID", 400);

    const messages = await ChatModel.find({
      artisanId: new mongoose.Types.ObjectId(artisanId),
    })
      .sort({ createdAt: 1 })
      .limit(100);

    return sendSuccess(res, messages);
  } catch (err) {
    console.error(err);
    return sendError(res, "Failed to fetch messages", 500);
  }
};
