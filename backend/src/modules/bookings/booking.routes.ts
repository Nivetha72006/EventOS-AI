import { Router } from "express";
import controller from "./booking.controller";

import { validate } from "../../middleware/validation.middleware";

import {
  createBookingSchema
} from "../../validators/booking.validator";

const router = Router();

router.post(
  "/",
  validate(createBookingSchema),
  (req, res, next) => controller.create(req, res, next)
);

router.get(
  "/event/:eventId",
  (req, res, next) => controller.getEventBookings(req, res, next)
);

router.get(
  "/vendor/:vendorId",
  (req, res, next) => controller.getVendorBookings(req, res, next)
);

export default router;