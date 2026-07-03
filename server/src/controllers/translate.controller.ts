import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response.util";

export const translateText = async (req: Request, res: Response) => {
  try {
    const { q, source = "en", target = "ne" } = req.body;
    if (!q || typeof q !== "string" || q.trim().length === 0)
      return sendError(res, "Text (q) is required", 400);

    // Use MyMemory API as a simple backend proxy
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      q,
    )}&langpair=${encodeURIComponent(source + "|" + target)}`;

    const r = await fetch(url);
    const data = (await r.json()) as {
      responseData?: { translatedText?: string };
    };
    if (data?.responseData?.translatedText) {
      return sendSuccess(res, { translated: data.responseData.translatedText });
    }

    return sendError(res, "Translation failed", 502);
  } catch (err) {
    console.error(err);
    return sendError(res, "Translation error", 500);
  }
};
