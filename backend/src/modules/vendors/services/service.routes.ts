import { Router } from "express";
import controller from "./service.controller";

const router = Router();

router.post("/", controller.create);

router.get("/:vendorId", controller.getVendorServices);

router.put("/:id", controller.update);

router.delete("/:id", controller.delete);

export default router;