import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/user/user.routes";
import eventRoutes from "../modules/event/event.routes";
import marketplaceRoutes from "../modules/marketplace/marketplace.routes";
import vendorRoutes from "../modules/vendors/vendor.routes";
import vendorServiceRoutes from "../modules/vendors/services/service.routes";
import bookingRoutes from "@/modules/bookings/booking.routes";
import quotationRoutes from "@/modules/quotations/quotation.routes";


const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/marketplace", marketplaceRoutes);
router.use("/vendors", vendorRoutes);
router.use("/vendor-services", vendorServiceRoutes);
router.use("/marketplace", marketplaceRoutes);
router.use("/bookings", bookingRoutes);
router.use("/quotations",quotationRoutes);

export default router;