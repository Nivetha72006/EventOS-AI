import { Router } from "express";
import { EventController } from "./event.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

import { validate } from "../../middleware/validation.middleware";

import {
  createEventSchema
} from "../../validators/event.validator";

const router = Router();
const controller = new EventController();

router.post(
  "/",
  authMiddleware,
  validate(createEventSchema),
  (req, res, next) =>
    controller.create(req, res, next)
);

router.get(
  "/",
  authMiddleware,
  (req, res, next) => controller.getAll(req, res, next)
);

router.get(
  "/:id",
  authMiddleware,
  (req, res, next) => controller.getOne(req, res, next)
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