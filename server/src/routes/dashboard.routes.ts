import { Router } from "express";
import {
  getDashboardStats,
  getTopRated,
} from "../controllers/dashboard.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserRole } from "../types/user.type";

const router = Router();

// Only admin can access dashboard
router.use(authenticate, authorize([UserRole.ADMIN]));

router.get("/stats", getDashboardStats);
router.get("/top-rated", getTopRated);

export default router;
