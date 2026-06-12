import { Router } from "express";
import {
  getAllSites,
  getSiteById,
  getHiddenGems,
  getMustVisitSites,
  getSitesByType,
  getSiteQuizzes,
  addReview,
  getSiteReviews,
} from "../controllers/site.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllSites);
router.get("/hidden-gem", getHiddenGems);
router.get("/must-visit", getMustVisitSites);
router.get("/type/:type", getSitesByType);
router.get("/:id", getSiteById);
router.get("/:id/quizzes", getSiteQuizzes);
router.get("/:id/reviews", getSiteReviews);
router.post("/:id/reviews", authenticate, addReview);

export default router;
