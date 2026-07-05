import { Router } from "express";
import controller from "./vendor.controller";

const router = Router();

router.post("/", (req, res) => controller.create(req, res));

router.put("/:id", (req, res) => controller.update(req, res));

router.get("/me/:ownerId", (req, res) =>
  controller.me(req, res)
);

export default router;