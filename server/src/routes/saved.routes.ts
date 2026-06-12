import { Router } from "express";
import {
  getSaved,
  saveItem,
  unsaveItem,
} from "../controllers/saved.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate); // all saved routes require auth

router.get("/", getSaved);
router.post("/", saveItem);
router.delete("/:itemId", unsaveItem);

export default router;
