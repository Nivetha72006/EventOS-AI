import { Router } from "express";
import controller from "./service.controller";

import { validate } from "../../../middleware/validation.middleware";

import {
  createVendorServiceSchema
} from "../../../validators/vendorService.validator";

const router = Router();

router.post(
  "/",
  validate(createVendorServiceSchema),
  (req, res, next) => controller.create(req, res, next)
);

router.get(
  "/:vendorId",
  (req, res, next) => controller.getVendorServices(req, res, next)
);

router.put(
  "/:id",
  (req, res, next) => controller.update(req, res, next)
);

router.delete(
  "/:id",
  (req, res, next) => controller.delete(req, res, next)
);

export default router;