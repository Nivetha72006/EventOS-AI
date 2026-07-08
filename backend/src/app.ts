import express from "express";
import cookieParser from "cookie-parser";

import routes from "./routes";
import vendorRoutes from "./modules/vendors/vendor.routes";
import recommendationRoutes from "./modules/recommendation/recommendation.routes";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", routes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Global Error Handler (ALWAYS LAST)
app.use(errorHandler);

export default app;