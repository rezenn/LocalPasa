import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/chat.controller";
import rateLimit from "express-rate-limit";

const router = Router();

const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });

router.post("/send", chatLimiter, sendMessage);
router.get("/:artisanId", chatLimiter, getMessages);

export default router;
