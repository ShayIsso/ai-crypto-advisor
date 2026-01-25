/**
 * News Service
 *
 * Handles integration with CryptoPanic API for cryptocurrency news
 */

import { NewsArticle } from "@/types/crypto.types";

/**
 * CryptoPanic API response shape
 * We only type the fields we actually use - keeps the code clean and maintainable
 */
interface CryptoPanicResponse {
  count: number;
  results: CryptoPanicArticle[];
}

/**
 * CryptoPanic article - only the fields we need
 */
interface CryptoPanicArticle {
  id: number;
  title: string;
  published_at: string;
  url: string;
  source: {
    title: string;
  };
  currencies?: Array<{
    code: string;
  }>;
}

/**
 * Get cryptocurrency news from CryptoPanic API
 *
 * @param limit - Maximum number of articles to return (default: 10)
 * @returns Array of news articles
 */
export const getCryptoNews = async (
  limit: number = 10,
): Promise<NewsArticle[]> => {
  try {
    const apiKey = process.env.CRYPTOPANIC_API_KEY;

    // If no API key, return fallback data
    if (!apiKey) {
      console.warn(
        "[news.service] No CRYPTOPANIC_API_KEY - using fallback data",
      );
      return getFallbackNews(limit);
    }

    // CryptoPanic free API endpoint
    const url = `https://cryptopanic.com/api/free/v1/posts/?auth_token=${apiKey}&public=true&kind=news`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`CryptoPanic API error: ${response.status}`);
    }

    const data = (await response.json()) as CryptoPanicResponse;

    // Transform to our clean format
    const articles: NewsArticle[] = data.results
      .slice(0, limit)
      .map(mapToNewsArticle);

    return articles;
  } catch (error) {
    console.error("[news.service] Error fetching news:", error);
    return getFallbackNews(limit);
  }
};

/**
 * Helper Mapper: Transforms API response to our internal NewsArticle type
 */
const mapToNewsArticle = (article: CryptoPanicArticle): NewsArticle => ({
  id: article.id.toString(),
  title: article.title,
  url: article.url,
  source: article.source.title,
  published_at: article.published_at,
  currencies: article.currencies?.map((c) => c.code.toLowerCase()) || [],
});

/**
 * Fallback news data when API is unavailable
 */
const getFallbackNews = (limit: number): NewsArticle[] => {
  const fallbackArticles: NewsArticle[] = [
    {
      id: "1",
      title: "Bitcoin ETF Sees Record Inflows",
      url: "https://example.com/news/1",
      source: "CoinDesk",
      published_at: new Date().toISOString(),
      currencies: ["btc"],
    },
    {
      id: "2",
      title: "Ethereum 2.0 Upgrade Shows Strong Progress",
      url: "https://example.com/news/2",
      source: "Cointelegraph",
      published_at: new Date(Date.now() - 3600000).toISOString(),
      currencies: ["eth"],
    },
    {
      id: "3",
      title: "Solana Network Reaches New Transaction Milestone",
      url: "https://example.com/news/3",
      source: "Decrypt",
      published_at: new Date(Date.now() - 7200000).toISOString(),
      currencies: ["sol"],
    },
    {
      id: "4",
      title: "DeFi Protocols See Increased Adoption",
      url: "https://example.com/news/4",
      source: "The Block",
      published_at: new Date(Date.now() - 10800000).toISOString(),
      currencies: ["eth", "sol"],
    },
    {
      id: "5",
      title: "Cardano Launches Smart Contract Update",
      url: "https://example.com/news/5",
      source: "CryptoSlate",
      published_at: new Date(Date.now() - 14400000).toISOString(),
      currencies: ["ada"],
    },
  ];

  return fallbackArticles.slice(0, limit);
};
