import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  getEventsByType,
  getUpcomingEvents,
  getCurrentMonthEvents,
} from "../controllers/event.controller";

const router = Router();

router.get("/", getAllEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/current-month", getCurrentMonthEvents);
router.get("/type/:type", getEventsByType);
router.get("/:id", getEventById);

export default router;
