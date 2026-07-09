import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resetPassword,
} from "../controllers/auth.controller";
import {
  ForgotPasswordDto,
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordDto,
} from "../dtos/user.dto";
import { authenticate } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";

const router = Router();

router.post("/register", validateBody(RegisterUserDto), register);
router.post("/login", validateBody(LoginUserDto), login);
router.get("/me", authenticate, me);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post(
  "/forgot-password",
  validateBody(ForgotPasswordDto),
  forgotPassword,
);
router.post("/reset-password", validateBody(ResetPasswordDto), resetPassword);

export default router;
