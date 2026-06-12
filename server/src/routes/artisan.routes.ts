import { Router } from "express";
import {
  getAllArtisans,
  getArtisanById,
  getArtisansByCraft,
  getArtisanProducts,
  getArtisanWorkshops,
  addArtisanReview,
  getArtisanReviews,
} from "../controllers/artisan.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllArtisans);
router.get("/craft/:craft", getArtisansByCraft);
router.get("/:id", getArtisanById);
router.get("/:id/products", getArtisanProducts);
router.get("/:id/workshops", getArtisanWorkshops);
router.get("/:id/reviews", getArtisanReviews);
router.post("/:id/reviews", authenticate, addArtisanReview);

export default router;
