import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getSavedStats,
  changePassword,
} from "../controllers/profile.controller";
import { ChangePasswordDto } from "../dtos/user.dto";
import { authenticate } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";

const router = Router();

router.use(authenticate);

router.get("/me", getProfile);
router.get("/saved/stats", getSavedStats);
router.patch("/update", updateProfile);
router.post("/change-password", validateBody(ChangePasswordDto), changePassword);

export default router;
