import { Router } from "express";
import controller from "./quotation.controller";

import { validate } from "../../middleware/validation.middleware";

import {
  createQuotationSchema
} from "../../validators/quotation.validator";

const router = Router();

router.post(
  "/",
  validate(createQuotationSchema),
  (req, res, next) => controller.create(req, res, next)
);

router.get(
  "/:bookingId",
  validate(createQuotationSchema),
  (req, res, next) => controller.get(req, res, next)
);

router.put(
  "/:id",
  (req, res, next) => controller.update(req, res, next)
);

export default router;