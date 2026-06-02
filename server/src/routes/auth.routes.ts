import { Router } from "express";
import { login, logout, me, refresh, register } from "../controllers/auth/auth.controller";
import { LoginUserDto, RegisterUserDto } from "../dtos/user.dto";
import { authenticate } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";

const router = Router();

router.post("/register", validateBody(RegisterUserDto), register);
router.post("/login", validateBody(LoginUserDto), login);
router.get("/me", authenticate, me);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
