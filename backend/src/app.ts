import express, { Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "@/middleware/errorHandler";
import authRoutes from "@/routes/auth.routes";

/**
 * Express Application Setup
 *
 * Configures the Express app with all middleware and routes.
 * Separated from server.ts for better testability.
 */

const app = express();

// ============================================
// 1. MIDDLEWARE
// ============================================

/**
 * CORS - Allow frontend to make requests
 * In production, restrict this to your actual frontend URL
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Allow cookies to be sent
  }),
);

/**
 * Parse JSON request bodies
 * Limit: 10mb (adjust based on your needs)
 */
app.use(express.json({ limit: "10mb" }));

/**
 * Request logging (development only)
 */
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// 2. ROUTES
// ============================================

/**
 * Health Check Endpoint
 * Useful for monitoring and deployment platforms
 */
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

/**
 * API Root
 */
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "AI Crypto Advisor API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
    },
  });
});

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);

// Future routes:
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/votes", voteRoutes);

// ============================================
// 3. 404 HANDLER
// ============================================

/**
 * Handle undefined routes
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// ============================================
// 4. ERROR HANDLER
// ============================================

/**
 * Global error handler (must be last)
 */
app.use(errorHandler);

export default app;
