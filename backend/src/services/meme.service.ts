/**
 * Meme Service
 *
 * Handles fetching crypto memes from Humorapi
 */

import { CryptoMeme } from "@/types/crypto.types";

/**
 * Humorapi response shape
 * Type only what we need from the API response
 */
interface HumorapiResponse {
  memes: Array<{
    id: number;
    url: string;
  }>;
}

/**
 * Get crypto memes
 *
 * @param limit - Number of memes to return
 * @param keywords - Search keywords (e.g., "bitcoin", "crypto")
 * @returns Array of meme objects
 */

export const getCryptoMemes = async (
  limit: number = 10,
  keywords: string = "crypto",
): Promise<CryptoMeme[]> => {
  try {
    const apiKey = process.env.HUMORAPI_API_KEY;

    // If no API key, return static memes
    if (!apiKey) {
      console.warn("[meme.service] No HUMORAPI_API_KEY - using static memes");
      return getStaticMemes(limit);
    }

    // Call Humorapi
    const response = await fetch(
      `https://api.humorapi.com/memes/search?number=${limit}&keywords=${keywords}`,
      {
        headers: {
          "x-api-key": apiKey, // Check API docs for correct header name!
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Humorapi error: ${response.status}`);
    }

    const data = (await response.json()) as HumorapiResponse;

    // Transform to our format
    const memes: CryptoMeme[] = data.memes.map((meme) => ({
      id: String(meme.id),
      url: meme.url,
    }));

    return memes;
  } catch (error) {
    console.error("[meme.service] Error fetching memes:", error);
    return getStaticMemes(limit);
  }
};

/**
 * Fallback static memes when API is unavailable
 */
const getStaticMemes = (limit: number): CryptoMeme[] => {
  const staticMemes: CryptoMeme[] = [
    {
      id: "1",
      url: "https://i.imgflip.com/65939r.jpg", // HODL meme
    },
    {
      id: "2",
      url: "https://i.imgflip.com/6593a3.jpg", // Bitcoin rollercoaster
    },
    {
      id: "3",
      url: "https://i.imgflip.com/6593af.jpg", // To the moon
    },
    {
      id: "4",
      url: "https://i.imgflip.com/6593b1.jpg", // Dip buying
    },
    {
      id: "5",
      url: "https://i.imgflip.com/6593bd.jpg", // Crypto portfolio
    },
  ];

  return staticMemes.slice(0, limit);
};
