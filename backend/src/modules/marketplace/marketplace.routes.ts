import { Router } from "express";
import controller from "./marketplace.controller";

const router = Router();

router.get(
  "/:eventId",
  (req, res, next) => controller.get(req, res, next)
);

export default router;