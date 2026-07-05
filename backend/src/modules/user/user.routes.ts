import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const controller = new UserController();

router.get("/", authMiddleware, (req, res) =>
  controller.getAllUsers(req, res)
);

router.get("/profile", authMiddleware, (req, res) =>
  controller.profile(req, res)
);

router.get("/:id", authMiddleware, (req, res) =>
  controller.getUser(req, res)
);

router.put("/:id", authMiddleware, (req, res) =>
  controller.update(req, res)
);

router.delete("/:id", authMiddleware, (req, res) =>
  controller.delete(req, res)
);

export default router;