import { Router } from "express";
import { translateText } from "../controllers/translate.controller";
import rateLimit from "express-rate-limit";

const router = Router();

const limiter = rateLimit({ windowMs: 60 * 1000, max: 30 });

router.post("/", limiter, translateText);

export default router;
