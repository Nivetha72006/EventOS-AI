import { Router } from "express";
import { RecommendationController } from "./recommendation.controller";

const router = Router();

const controller = new RecommendationController();

router.post(
  "/:eventId",
  controller.generate.bind(controller)
);

export default router;