import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getSavedStats,
} from "../controllers/profile.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/me", getProfile);
router.get("/saved/stats", getSavedStats);
router.patch("/update", updateProfile);

export default router;
