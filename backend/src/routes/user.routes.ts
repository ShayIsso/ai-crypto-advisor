import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import {
  getMeHandler,
  getPreferencesHandler,
  updatePreferencesHandler,
} from "@/controllers/user.controller";
import { preferencesSchema } from "@/schemas/preferences.schema";

/**
 * User Routes (Protected)
 *
 * All routes require authentication
 *
 * GET  /api/user/me           - Get user profile
 * GET  /api/user/preferences  - Get user preferences
 * PUT  /api/user/preferences  - Update preferences (onboarding)
 */

const router = Router();

/**
 * GET /api/user/me
 * Get current user's full profile
 */
router.get("/me", authenticate, getMeHandler);

/**
 * GET /api/user/preferences
 * Get user preferences
 * Returns null if onboarding not completed
 */
router.get("/preferences", authenticate, getPreferencesHandler);

/**
 * PUT /api/user/preferences
 * Update user preferences (onboarding)
 */
router.put(
  "/preferences",
  authenticate,
  validate(preferencesSchema),
  updatePreferencesHandler,
);

export default router;
