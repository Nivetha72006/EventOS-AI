import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const controller = new UserController();

router.get(
  "/",
  authMiddleware,
  (req, res, next) => controller.getAllUsers(req, res, next)
);

router.get(
  "/profile",
  authMiddleware,
  (req, res, next) => controller.profile(req, res, next)
);

router.get(
  "/:id",
  authMiddleware,
  (req, res, next) => controller.getUser(req, res, next)
);

router.put(
  "/:id",
  authMiddleware,
  (req, res, next) => controller.update(req, res, next)
);

router.delete(
  "/:id",
  authMiddleware,
  (req, res, next) => controller.delete(req, res, next)
);

export default router;