import { Router } from "express";
import controller from "./vendor.controller";

import { validate } from "../../middleware/validation.middleware";

import {
  createVendorSchema
} from "../../validators/vendor.validator";


const router = Router();

router.post(
  "/",
  validate(createVendorSchema),
  (req, res, next) =>
    controller.create(req, res, next)
);

router.put(
  "/:id",
  (req, res, next) => controller.update(req, res, next)
);

router.get(
  "/me/:ownerId",
  (req, res, next) => controller.me(req, res, next)
);

export default router;