import { Router } from "express";
import controller from "./emergency.controller";

const router = Router();

router.post(
  "/",
  (req, res, next) =>
    controller.findReplacement(req, res, next)
);

export default router;