import { Router } from "express";
import {
  globalSearch,
  getSearchSuggestions,
} from "../controllers/search.controller";

const router = Router();

router.get("/", globalSearch);
router.get("/suggestions", getSearchSuggestions);

export default router;
