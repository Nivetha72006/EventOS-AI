import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import vendorRoutes from "./modules/vendors/vendor.routes";
import recommendationRoutes from "./modules/recommendation/recommendation.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);
app.use("/api/vendors", vendorRoutes);
app.use(errorHandler);
app.use("/api/recommendations", recommendationRoutes);

export default app;
