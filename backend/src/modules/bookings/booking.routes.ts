import { Router } from "express";
import controller from "./booking.controller";

const router = Router();

router.post("/", controller.create);

router.get("/event/:eventId", controller.getEventBookings);

router.get("/vendor/:vendorId", controller.getVendorBookings);

export default router;