import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import {
  getPricesHandler,
  getNewsHandler,
  getAIInsightHandler,
  getMemesHandler,
} from "@/controllers/dashboard.controller";

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

/**
 * GET /api/dashboard/news
 * Get cryptocurrency news filtered by user preferences
 */
router.get("/news", authenticate, getNewsHandler);

/**
 * GET /api/dashboard/ai
 * Get AI-generated crypto insights personalized to user preferences
 */
router.get("/ai", authenticate, getAIInsightHandler);

/**
 * GET /api/dashboard/memes
 * Get crypto memes
 */
router.get("/memes", authenticate, getMemesHandler);
export default router;
