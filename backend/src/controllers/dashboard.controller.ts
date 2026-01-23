import { Request, Response } from "express";
import { asyncHandler } from "@/middleware/errorHandler";
import { getCryptoPrices } from "@/services/crypto.service";
import { prisma } from "@/lib/prisma";

/**
 * Dashboard Controller
 * 
 * Handles requests for dashboard data (prices, news, AI insights)
 */

/**
 * GET /api/dashboard/prices
 * Get cryptocurrency prices based on user preferences
 * 
 * Protected route - requires authentication
 */
export const getPricesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // req.user is available from authenticate middleware
    const userId = req.user!.id;

    // 1. Get user preferences to know which coins to show
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });

    // 2. Extract coin IDs from preferences, or use defaults
    let coinIds = ["bitcoin", "ethereum", "cardano", "solana"];
    
    if (user?.preferences && typeof user.preferences === "object") {
      const prefs = user.preferences as any;
      if (prefs.coins && Array.isArray(prefs.coins)) {
        coinIds = prefs.coins;
      }
    }

    // 3. Fetch prices from CoinGecko API
    const prices = await getCryptoPrices(coinIds);

    // 4. Return response
    res.json({
      success: true,
      data: {
        prices,
        count: prices.length,
      },
    });
  },
);
