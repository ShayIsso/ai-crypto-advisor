import { z } from "zod";

/**
 * Validation schemas for user preferences (onboarding)
 */

/**
 * Valid investor types
 */
const investorTypes = [
  "HODLer",
  "Day Trader",
  "Swing Trader",
  "NFT Collector",
  "DeFi Enthusiast",
  "Miner",
  "Staker",
] as const;

/**
 * Valid content preferences
 */
const contentTypes = [
  "prices",
  "news",
  "ai-insights",
  "memes",
  "charts",
  "social",
] as const;

/**
 * Common cryptocurrency IDs supported by CoinGecko
 */
const supportedCoins = [
  "bitcoin",
  "ethereum",
  "cardano",
  "solana",
  "binancecoin",
  "ripple",
  "dogecoin",
  "polkadot",
  "avalanche-2",
  "chainlink",
  "polygon",
  "litecoin",
  "uniswap",
  "cosmos",
  "stellar",
] as const;

/**
 * Preferences Update Schema
 * Validates user preferences during onboarding
 */
export const preferencesSchema = z.object({
  coins: z
    .array(z.enum(supportedCoins))
    .min(1, "Select at least 1 cryptocurrency")
    .max(10, "Maximum 10 cryptocurrencies allowed")
    .default(["bitcoin", "ethereum", "solana", "cardano"]),

  investorType: z
    .enum(investorTypes)
    .default("HODLer"),

  contentPreferences: z
    .array(z.enum(contentTypes))
    .min(1, "Select at least 1 content type")
    .max(6, "Maximum 6 content types allowed")
    .default(["prices", "news", "ai-insights"]),
});

/**
 * Type inference
 */
export type PreferencesInput = z.infer<typeof preferencesSchema>;

/**
 * Preferences structure (what gets stored in DB)
 */
export interface UserPreferences extends PreferencesInput {
  onboardingCompleted: boolean;
  lastUpdated: string;
}
