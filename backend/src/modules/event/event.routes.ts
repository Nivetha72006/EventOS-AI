import { Router } from "express";
import { EventController } from "./event.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const controller = new EventController();

router.post("/", authMiddleware, (req, res) => controller.create(req, res));
router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));
router.get("/:id", authMiddleware, (req, res) => controller.getOne(req, res));
router.put("/:id", authMiddleware, (req, res) => controller.update(req, res));
router.delete("/:id", authMiddleware, (req, res) => controller.delete(req, res));

export default router;