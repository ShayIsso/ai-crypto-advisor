/**
 * Vote Service
 *
 * Handles voting operations
 */

import { prisma } from "@/lib/prisma";
import { Vote, VoteSection, VoteStats } from "@/types/vote.types";

/**
 * Cast a vote on a dashboard
 *
 * @param userId - User ID
 * @param section - Section to vote on
 * @param vote - true for upvote, false for downvote
 * @returns Created vote
 */
export const castVote = async (
  userId: number,
  section: VoteSection,
  vote: boolean,
): Promise<Vote> => {
  const newVote = await prisma.vote.create({
    data: {
      userId,
      section,
      vote,
    },
  });

  return newVote;
};

/**
 * Get user's voting history
 *
 * @param userId - User ID
 * @returns Array of user's votes, most recent first
 */
export const getUserVotes = async (userId: number): Promise<Vote[]> => {
  const votes = await prisma.vote.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return votes;
};

/**
 * Get voting statistics for all sections
 *
 * @returns Statistics for each section
 */
export const getVoteStats = async (): Promise<VoteStats> => {
  const stats = await prisma.vote.groupBy({
    by: ["section", "vote"],
    _count: {
      vote: true,
    },
  });

  const initialStats: VoteStats = {
    prices: { upvotes: 0, downvotes: 0 },
    news: { upvotes: 0, downvotes: 0 },
    ai: { upvotes: 0, downvotes: 0 },
    memes: { upvotes: 0, downvotes: 0 },
  };

  return stats.reduce((acc, curr) => {
    const section = curr.section as keyof VoteStats;
    if (curr.vote) {
      acc[section].upvotes = curr._count.vote;
    } else {
      acc[section].downvotes = curr._count.vote;
    }
    return acc;
  }, initialStats);
};
