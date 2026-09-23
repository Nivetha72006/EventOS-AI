import { Router } from "express";
import controller from "./design.controller";

const router = Router();

router.post(
  "/",
  (req, res, next) =>
    controller.generate(req, res, next)
);

router.post(
  "/image",
  (req, res, next) =>
    controller.generateImage(req, res, next)
);

export default router;