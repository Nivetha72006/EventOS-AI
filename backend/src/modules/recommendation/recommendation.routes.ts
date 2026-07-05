import { Router } from "express";
import { RecommendationController } from "./recommendation.controller";

const router = Router();

const controller = new RecommendationController();

router.get("/:eventId", controller.generate);

export default router;