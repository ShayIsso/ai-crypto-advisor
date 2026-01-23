import { Request, Response } from "express";
import { asyncHandler } from "@/middleware/errorHandler";
import {
  getUserPreferences,
  updateUserPreferences,
  getUserProfile,
} from "@/services/user.service";
import type { PreferencesInput } from "@/schemas/preferences.schema";

/**
 * User Controller
 *
 * Handles user profile and preferences operations
 */

/**
 * GET /api/user/me
 * Get current user's full profile
 */
export const getMeHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const profile = await getUserProfile(userId);

    res.json({
      success: true,
      data: {
        user: profile,
      },
    });
  },
);

/**
 * GET /api/user/preferences
 * Get user preferences
 *
 * Returns null if user hasn't completed onboarding yet
 */
export const getPreferencesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const preferences = await getUserPreferences(userId);

    res.json({
      success: true,
      data: {
        preferences,
        hasCompletedOnboarding: preferences?.onboardingCompleted ?? false,
      },
    });
  },
);

/**
 * PUT /api/user/preferences
 * Update user preferences (onboarding)
 *
 * Request body validated by preferencesSchema
 */
export const updatePreferencesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const preferencesData = req.body as PreferencesInput;

    const updatedPreferences = await updateUserPreferences(
      userId,
      preferencesData,
    );

    res.json({
      success: true,
      message: "Preferences updated successfully",
      data: {
        preferences: updatedPreferences,
      },
    });
  },
);
