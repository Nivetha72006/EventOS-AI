import { Router } from "express";
import controller from "./message.controller";

const router=Router();

router.post(
  "/",
  (req, res, next) => controller.send(req, res, next)
);

router.get(
  "/:user1/:user2",
  (req, res, next) => controller.conversation(req, res, next)
);

export default router;