import { Router } from "express";
import controller from "./ai.controller";
import emergencyRoutes from "./emergency/emergency.routes";
import negotiationRoutes from "./negotiation/negotiation.routes";

const router = Router();

router.get("/health", (req, res, next) => controller.health(req, res, next));

// Chat – AI Assistant page
router.post("/chat", (req, res, next) => controller.chat(req, res, next));

// Design concept generation
router.post("/design/describe", (req, res, next) =>
  controller.generateDesignDescription(req, res, next)
);

// Marketplace vendor AI recommendations
router.post("/vendors/recommend", (req, res, next) =>
  controller.recommendVendors(req, res, next)
);

router.use("/emergency", emergencyRoutes);
router.use("/negotiation", negotiationRoutes);

export default router;