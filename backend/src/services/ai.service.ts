/**
 * AI Service
 *
 * Generates personalized crypto insights using OpenRouter API
 */

import { CryptoInsight } from "@/types/crypto.types";

/**
 * OpenRouter API response - only what we need
 * We only care about the generated text content
 */
interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string; // The AI's response - this is all we need!
    };
  }>;
}

/**
 * Prompt templates by investor type
 * Template functions receive formatted coin list (e.g., "BTC, ETH, SOL")
 */
const PROMPT_TEMPLATES: Record<string, (coins: string) => string> = {
  HODLer: (coins) =>
    `You're advising a long-term crypto investor (HODLer) who holds ${coins}. Provide a brief insight about long-term fundamentals and market trends for these assets today.`,

  "Day Trader": (coins) =>
    `You're advising an active day trader focused on ${coins}. Provide a brief insight about today's price action, volatility, and short-term trading opportunities.`,

  "Swing Trader": (coins) =>
    `You're advising a swing trader (holds 1-4 weeks) interested in ${coins}. Provide a brief insight about medium-term price trends and key support/resistance levels.`,

  "NFT Collector": (coins) =>
    `You're advising an NFT enthusiast who follows ${coins}. Provide a brief insight about NFT trends, collections, and market activity on these blockchains.`,

  "DeFi Enthusiast": (coins) =>
    `You're advising a DeFi investor focused on ${coins}. Provide a brief insight about DeFi protocol developments, yields, and ecosystem updates.`,

  Miner: (coins) =>
    `You're advising a crypto miner focused on ${coins}. Provide a brief insight about mining profitability, network difficulty, and hardware considerations.`,

  Staker: (coins) =>
    `You're advising someone who stakes ${coins}. Provide a brief insight about staking rewards, network updates, and validator opportunities.`,
};

/**
 * Default prompt template when investor type is unknown
 */
const DEFAULT_PROMPT = (coins: string) =>
  `Provide a brief crypto market insight about ${coins} for today.`;

/**
 * Fallback insights by investor type when API is unavailable
 * Static but still personalized content
 */
const FALLBACK_INSIGHTS: Record<string, (coins: string) => string> = {
  HODLer: (coins) =>
    `For long-term holders of ${coins}: Market fundamentals remain strong despite short-term volatility. Continue dollar-cost averaging and ignore daily noise. Focus on technology development and adoption metrics.`,

  "Day Trader": (coins) =>
    `For active traders on ${coins}: Watch for breakout patterns above key resistance levels. Volume has been increasing, suggesting potential momentum. Set tight stop-losses in this volatile environment.`,

  "Swing Trader": (coins) =>
    `For swing traders holding ${coins}: Medium-term trend remains bullish. Consider taking partial profits near resistance zones and re-entering on pullbacks to support levels.`,

  "NFT Collector": (coins) =>
    `For NFT enthusiasts on ${coins}: Blue-chip collections continue to show resilience. Watch for new launches on these chains. Floor prices stabilizing after recent market movements.`,

  "DeFi Enthusiast": (coins) =>
    `For DeFi investors on ${coins}: Total Value Locked (TVL) showing steady growth. New yield opportunities emerging in liquidity pools. Always verify smart contract audits before depositing.`,

  Miner: (coins) =>
    `For miners of ${coins}: Network hash rate stable. Energy costs remain the key profitability factor. Consider joining mining pools for more consistent rewards.`,

  Staker: (coins) =>
    `For stakers of ${coins}: Staking yields remain attractive. Network security continues to improve. Ensure you're using reputable validators with good uptime.`,
};

/**
 * Default fallback insight when investor type is unknown
 */
const DEFAULT_FALLBACK = (coins: string) =>
  `Market analysis for ${coins}: Stay informed, manage risk, and make decisions based on your investment strategy and risk tolerance.`;

/**
 * Generate AI crypto insight based on user preferences
 *
 * @param investorType - User's investor profile
 * @param coins - Array of coin IDs user is interested in
 * @returns AI-generated insight
 */
export const generateCryptoInsight = async (
  investorType: string,
  coins: string[],
): Promise<CryptoInsight> => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    // If no API key, return static insight
    if (!apiKey) {
      console.warn("[ai.service] No OPENROUTER_API_KEY - using static insight");
      return getStaticInsight(investorType, coins);
    }

    // Build personalized prompt based on investor type
    const prompt = buildPrompt(investorType, coins);

    // Call OpenRouter API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
          "X-Title": "AI Crypto Advisor",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", // Cheap, reliable model (~$0.0015 per insight)
          messages: [
            {
              role: "system",
              content:
                "You are a helpful crypto investment advisor. Provide brief, actionable insights in 2-3 sentences. Be concise and specific.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 150, // Keep insights brief (~$0.0015 per call)
          temperature: 0.7, // Balanced creativity
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = (await response.json()) as OpenRouterResponse;

    // Extract the AI's response
    const content = data.choices[0]?.message?.content || "";

    if (!content) {
      throw new Error("Empty response from AI");
    }

    return {
      content,
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      coins_mentioned: coins,
      generated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("[ai.service] Error generating insight:", error);
    return getStaticInsight(investorType, coins);
  }
};

/**
 * Build personalized prompt based on investor type
 * Uses extracted prompt templates for clarity and reusability
 */
const buildPrompt = (investorType: string, coins: string[]): string => {
  const coinsList = coins.map((c) => c.toUpperCase()).join(", ");
  const template = PROMPT_TEMPLATES[investorType] || DEFAULT_PROMPT;
  return template(coinsList);
};

/**
 * Get static fallback insight when API is unavailable
 * Uses extracted fallback templates for clarity and reusability
 */
const getStaticInsight = (
  investorType: string,
  coins: string[],
): CryptoInsight => {
  const coinsList = coins.map((c) => c.toUpperCase()).join(", ");
  const template = FALLBACK_INSIGHTS[investorType] || DEFAULT_FALLBACK;
  const content = template(coinsList);

  return {
    content,
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    coins_mentioned: coins,
    generated_at: new Date().toISOString(),
  };
};
