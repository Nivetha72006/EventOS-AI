import { Router } from "express";
import controller from "./negotiation.controller";

const router = Router();

router.post(
  "/",
  (req, res, next) =>
    controller.negotiate(req, res, next)
);

export default router;