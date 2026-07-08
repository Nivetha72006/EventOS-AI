import { Router } from "express";
import { AuthController } from "./auth.controller";

import { validate } from "../../middleware/validation.middleware";

import {
  registerSchema,
  loginSchema
} from "../../validators/auth.validator";

const router = Router();

const controller = new AuthController();

router.post(
  "/register",
  validate(registerSchema),
  (req, res, next) =>
    controller.register(req, res, next)
);

router.post(
  "/login",
  validate(loginSchema),
  (req, res, next) =>
    controller.login(req, res, next)
);

export default router;