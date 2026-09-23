import { Router } from "express";
import plannerController from "./planner.controller";

const router = Router();

router.post(
    "/generate",
    plannerController.generate
);

export default router;