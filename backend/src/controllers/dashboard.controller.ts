import { Request, Response } from "express";
import { asyncHandler } from "@/middleware/errorHandler";
import { getCryptoPrices } from "@/services/crypto.service";
import { getCryptoNews } from "@/services/news.service";
import {
  getUserCoins,
  getUserDashboardPreferences,
} from "@/services/user.service";
import { generateCryptoInsight } from "@/services/ai.service";
import { getCryptoMemes } from "@/services/meme.service";

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
    const coins = await getUserCoins(req.user!.id);
    const prices = await getCryptoPrices(coins);

    res.json({
      success: true,
      data: {
        prices,
        count: prices.length,
      },
    });
  },
);

/**
 * GET /api/dashboard/news
 * Get cryptocurrency news filtered by user preferences
 *
 * Protected route - requires authentication
 */
export const getNewsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const coins = await getUserCoins(req.user!.id);
    const allNews = await getCryptoNews(50); // Fetch more for filtering

    // Filter news that mention user's coins
    let filteredNews = allNews.filter((article) =>
      article.currencies.some((currency) => coins.includes(currency)),
    );

    // If no matches, show all news (better than empty)
    if (filteredNews.length === 0) {
      filteredNews = allNews;
    }

    // Limit to 10 most recent
    const news = filteredNews.slice(0, 10);

    res.json({
      success: true,
      data: {
        news,
        count: news.length,
        filtered: filteredNews.length < allNews.length,
      },
    });
  },
);

/**
 * GET /api/dashboard/ai
 * Get personalized AI crypto insight based on user preferences
 *
 * Protected route - requires authentication
 */

export const getAIInsightHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { coins, investorType } = await getUserDashboardPreferences(
      req.user!.id,
    );
    const insight = await generateCryptoInsight(investorType, coins);
    res.json({ success: true, data: { insight } });
  },
);

// Fix the handler name and implement it
/**
 * GET /api/dashboard/memes
 * Get crypto memes
 *
 * Protected route - requires authentication
 */
export const getMemesHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    // Get memes (10 by default)
    const memes = await getCryptoMemes(10, "bitcoin");

    res.json({
      success: true,
      data: {
        memes,
        count: memes.length,
      },
    });
  },
);
