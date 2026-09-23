import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";

import routes from "./routes";
import vendorRoutes from "./modules/vendors/vendor.routes";
import recommendationRoutes from "./modules/recommendation/recommendation.routes";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".netlify.app") ||
        origin.endsWith(".onrender.com") ||
        origin.endsWith(".koyeb.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "EventOS AI Backend is running 🚀",
  });
});

// Main API routes
app.use("/api", routes);

// Vendor routes
app.use("/api/vendors", vendorRoutes);

// Recommendation routes
app.use("/api/recommendations", recommendationRoutes);

// Generated AI Design Images
app.use(
  "/generated-designs",
  express.static(
    path.join(process.cwd(), "generated-designs")
  )
);

// Global error handler - ALWAYS LAST
app.use(errorHandler);

export default app;