/**
 * Cryptocurrency Domain Types
 *
 * These types represent our application's crypto data model.
 * They are used across services, controllers, and will be shared with the frontend.
 */

/**
 * Represents cryptocurrency price data
 * This is what our service returns - a clean, application-specific format
 */
export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

/**
 * Cryptocurrency news article
 * TODO: Implement when building news service
 */
export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  published_at: string;
  currencies: string[];
  sentiment?: "positive" | "negative" | "neutral";
}

/**
 * AI-generated crypto insight
 * TODO: Implement when building AI insight service
 */
export interface CryptoInsight {
  date: string;
  content: string;
  coins_mentioned: string[];
  generated_at: string;
}
