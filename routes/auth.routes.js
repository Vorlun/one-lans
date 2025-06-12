import { Router } from "express";
import { login, logout, refreshToken } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validate.js";
import { loginSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/login", validateBody(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
