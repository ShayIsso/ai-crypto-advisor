import { Request, Response } from "express";
import { asyncHandler } from "@/middleware/errorHandler";
import { castVote, getUserVotes, getVoteStats } from "@/services/vote.service";
import type { CastVoteInput } from "@/schemas/vote.schema";

/**
 * POST /api/votes
 * Cast a vote on a dashboard section
 */
export const castVoteHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const { section, vote } = req.body as CastVoteInput;

    const newVote = await castVote(userId, section, vote);

    res.status(201).json({
      success: true,
      message: "Vote recorded",
      data: { vote: newVote },
    });
  },
);

/**
 * GET /api/votes/my-votes
 * Get current user's voting history
 */
export const getMyVotesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const votes = await getUserVotes(userId);

    res.json({
      success: true,
      data: {
        votes,
        count: votes.length,
      },
    });
  },
);

/**
 * GET /api/votes/stats
 * Get voting statistics
 */
export const getVoteStatsHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await getVoteStats();
    res.json({
      success: true,
      data: {
        stats,
      },
    });
  },
);
