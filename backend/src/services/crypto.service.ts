/**
 * Crypto Service
 *
 * Handles integration with CoinGecko API for cryptocurrency data
 */

interface CoinPrice {
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

interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

/**
 * Get cryptocurrency prices from CoinGecko API
 *
 * @param coinIds - Array of coin IDs (e.g., ['bitcoin', 'ethereum'])
 * @returns Array of coin price data
 */
export const getCryptoPrices = async (
  coinIds: string[] = ["bitcoin", "ethereum", "cardano", "solana"],
): Promise<CoinPrice[]> => {
  try {
    // CoinGecko API endpoint
    // Using Demo API (free tier) - supports API key for better rate limits
    const ids = coinIds.join(",");
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`;

    // Prepare headers - include API key if available for better rate limits
    const headers: Record<string, string> = {};
    const apiKey = process.env.COINGECKO_API_KEY;
    if (apiKey) {
      headers["x-cg-demo-api-key"] = apiKey;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = (await response.json()) as CoinGeckoResponse[];

    // Transform to our format
    return data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      image: coin.image,
    }));
  } catch (error) {
    console.error("[crypto.service] Error fetching prices:", error);

    // Return fallback data if API fails
    return getFallbackPrices(coinIds);
  }
};

/**
 * Fallback data when API is unavailable
 */
const getFallbackPrices = (coinIds: string[]): CoinPrice[] => {
  const fallbackData: Record<string, CoinPrice> = {
    bitcoin: {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      current_price: 45000,
      price_change_24h: 1250,
      price_change_percentage_24h: 2.85,
      market_cap: 880000000000,
      total_volume: 25000000000,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    },
    ethereum: {
      id: "ethereum",
      symbol: "ETH",
      name: "Ethereum",
      current_price: 2400,
      price_change_24h: -45,
      price_change_percentage_24h: -1.84,
      market_cap: 290000000000,
      total_volume: 12000000000,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    },
    cardano: {
      id: "cardano",
      symbol: "ADA",
      name: "Cardano",
      current_price: 0.52,
      price_change_24h: 0.03,
      price_change_percentage_24h: 6.12,
      market_cap: 18000000000,
      total_volume: 450000000,
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    },
    solana: {
      id: "solana",
      symbol: "SOL",
      name: "Solana",
      current_price: 105,
      price_change_24h: 8.5,
      price_change_percentage_24h: 8.8,
      market_cap: 45000000000,
      total_volume: 2500000000,
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    },
  };

  return coinIds
    .map((id) => fallbackData[id])
    .filter((coin): coin is CoinPrice => coin !== undefined);
};
