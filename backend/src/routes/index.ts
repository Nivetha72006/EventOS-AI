// import { Router } from "express";

// import authRoutes from "../modules/auth/auth.routes";
// import userRoutes from "../modules/user/user.routes";
// import eventRoutes from "../modules/event/event.routes";
// import marketplaceRoutes from "../modules/marketplace/marketplace.routes";
// import vendorRoutes from "../modules/vendors/vendor.routes";
// import vendorServiceRoutes from "../modules/vendors/services/service.routes";
// import bookingRoutes from "@/modules/bookings/booking.routes";
// import quotationRoutes from "@/modules/quotations/quotation.routes";
// import notificationRoutes from "@/modules/notifications/notification.routes";
// import messageRoutes from "@/modules/messages/message.routes";
// import aiRoutes from "../modules/ai/ai.routes";
// import plannerRoutes from "../modules/planner/planner.routes";
// import recommendationRoutes from "../modules/recommendation/recommendation.routes";


// const router = Router();

// router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
// router.use("/events", eventRoutes);
// router.use("/marketplace", marketplaceRoutes);
// router.use("/vendors", vendorRoutes);
// router.use("/vendor-services", vendorServiceRoutes);
// router.use("/marketplace", marketplaceRoutes);
// router.use("/bookings", bookingRoutes);
// router.use("/quotations",quotationRoutes);
// router.use("/notifications",notificationRoutes);
// router.use("/messages", messageRoutes);
// router.use("/ai", aiRoutes);
// router.use("/planner", plannerRoutes);
// router.use(
//   "/recommendations",
//   recommendationRoutes
// );

// export default router;

import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/user/user.routes";
import vendorRoutes from "../modules/vendors/vendor.routes";
import eventRoutes from "../modules/event/event.routes";
import bookingRoutes from "../modules/bookings/booking.routes";
import quotationRoutes from "../modules/quotations/quotation.routes";
import notificationRoutes from "../modules/notifications/notification.routes";
import messageRoutes from "../modules/messages/message.routes";
import plannerRoutes from "../modules/planner/planner.routes";
import recommendationRoutes from "../modules/recommendation/recommendation.routes";
import marketplaceRoutes from "../modules/marketplace/marketplace.routes";
import aiRoutes from "../modules/ai/ai.routes";
import designRoutes from "../modules/ai/design/design.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/vendors", vendorRoutes);
router.use("/events", eventRoutes);
router.use("/bookings", bookingRoutes);
router.use("/quotations", quotationRoutes);
router.use("/notifications", notificationRoutes);
router.use("/messages", messageRoutes);
router.use("/planner", plannerRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/marketplace", marketplaceRoutes);
router.use("/ai", aiRoutes);
router.use("/ai/design", designRoutes);

export default router;