import { Router } from "express";
import { RecommendationController } from "./recommendation.controller";

const router = Router();

const controller = new RecommendationController();

router.get(
  "/:eventId",
  (req, res, next) => controller.generate(req, res, next)
);

export default router;