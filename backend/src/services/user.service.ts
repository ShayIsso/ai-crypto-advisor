import { prisma } from "@/lib/prisma";
import { AppError } from "@/middleware/errorHandler";
import {
  preferencesSchema,
  type PreferencesInput,
  type UserPreferences,
} from "@/schemas/preferences.schema";

/**
 * User Service
 *
 * Handles user-related operations (preferences, profile)
 */

/**
 * Default coins when user has no preferences or invalid data
 * Used as fallback throughout the app
 */
export const DEFAULT_COINS: readonly string[] = [
  "bitcoin",
  "ethereum",
  "cardano",
  "solana",
];

/**
 * Get user preferences
 *
 * @param userId - User ID
 * @returns User preferences or null if not set
 */
export const getUserPreferences = async (
  userId: number,
): Promise<UserPreferences | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { preferences: true },
  });

  if (!user || !user.preferences) {
    return null;
  }

  // Prisma returns Json as any, so we need to cast it
  return user.preferences as unknown as UserPreferences;
};

/**
 * Get user's coin preferences with validation and fallback
 *
 * Uses Zod safeParse to validate DB data at runtime.
 * Returns default coins if preferences are missing or invalid.
 *
 * @param userId - User ID
 * @returns Array of coin IDs (validated or defaults)
 */
export const getUserCoins = async (userId: number): Promise<string[]> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { preferences: true },
  });

  if (user?.preferences && typeof user.preferences === "object") {
    const result = preferencesSchema.safeParse(user.preferences);
    if (result.success) {
      return result.data.coins;
    }
  }

  return [...DEFAULT_COINS];
};

/**
 * Update user preferences (onboarding)
 *
 * @param userId - User ID
 * @param preferences - New preferences
 * @returns Updated preferences
 */
export const updateUserPreferences = async (
  userId: number,
  preferences: PreferencesInput,
): Promise<UserPreferences> => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Prepare preferences object with metadata
  const preferencesData: UserPreferences = {
    ...preferences,
    onboardingCompleted: true,
    lastUpdated: new Date().toISOString(),
  };

  // Update user preferences
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      preferences: preferencesData as any, // Prisma Json type
    },
    select: {
      preferences: true,
    },
  });

  return updatedUser.preferences as unknown as UserPreferences;
};

/**
 * Get user profile (without password)
 *
 * @param userId - User ID
 * @returns User profile
 */
export const getUserProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      preferences: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};
