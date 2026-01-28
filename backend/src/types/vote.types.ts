/**
 * Domain types for voting system
 */

// Valid sections that can be voted on
export type VoteSection = "prices" | "news" | "ai" | "memes";

// Vote response from database
export interface Vote {
  id: number;
  userId: number;
  section: VoteSection;
  vote: boolean;
  createdAt: Date;
}

// Stats for a section
export interface SectionStats {
  upvotes: number;
  downvotes: number;
}

// Overall voting statistics
export interface VoteStats {
  prices: SectionStats;
  news: SectionStats;
  ai: SectionStats;
  memes: SectionStats;
}
