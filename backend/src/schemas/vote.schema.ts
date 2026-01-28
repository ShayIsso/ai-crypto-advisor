import { z } from "zod";

/**
 * Valid sections that can be voted on
 */
const voteSections = ["prices", "news", "ai", "memes"] as const;

/**
 * Schema for casting a vote
 */
export const castVoteSchema = z.object({
  section: z.enum(voteSections, {
    message: "Section must be one of: prices, news, ai, memes",
  }),
  vote: z.boolean({
    message: "Vote must be a boolean (true for upvote, false for downvote)",
  }),
});

export type CastVoteInput = z.infer<typeof castVoteSchema>;
