import { Router } from "express";
import controller from "./quotation.controller";

const router=Router();

router.post("/",controller.create);

router.get("/:bookingId",controller.get);

router.put("/:id",controller.update);

export default router;