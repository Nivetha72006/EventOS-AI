import { Router } from "express";
import controller from "./notification.controller";

const router = Router();

router.post(
  "/",
  (req, res, next) => controller.create(req, res, next)
);

router.get(
  "/:userId",
  (req, res, next) => controller.get(req, res, next)
);

router.put(
  "/:id/read",
  (req, res, next) => controller.read(req, res, next)
);

export default router;