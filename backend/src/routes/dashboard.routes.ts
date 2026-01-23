import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { getPricesHandler } from "@/controllers/dashboard.controller";

/**
 * Dashboard Routes
 * 
 * All routes require authentication
 * 
 * GET /api/dashboard/prices - Get crypto prices
 * GET /api/dashboard/news   - Get crypto news (TODO: implement)
 * GET /api/dashboard/ai     - Get AI insights (TODO: implement)
 */

const router = Router();

/**
 * GET /api/dashboard/prices
 * Get cryptocurrency prices based on user preferences
 */
router.get("/prices", authenticate, getPricesHandler);

// TODO: Add news route here
// router.get("/news", authenticate, getNewsHandler);

// TODO: Add AI insights route here
// router.get("/ai", authenticate, getAIInsightsHandler);

export default router;
