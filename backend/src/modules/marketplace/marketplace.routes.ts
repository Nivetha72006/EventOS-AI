import { Router } from "express";

import controller from "./marketplace.controller";

const router = Router();

router.get("/:eventId", controller.get);

export default router;