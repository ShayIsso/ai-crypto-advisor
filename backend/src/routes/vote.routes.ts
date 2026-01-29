import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import {
  castVoteHandler,
  getMyVotesHandler,
  getVoteStatsHandler,
} from "@/controllers/vote.controller";
import { castVoteSchema } from "@/schemas/vote.schema";

const router = Router();
/**
 * All vote routes require authentication
 */

/**
 * POST /api/votes
 * Cast a vote on a section
 */
router.post("/", authenticate, validate(castVoteSchema), castVoteHandler);

/**
 * GET /api/votes/my-votes
 * Get user's voting history
 */
router.get("/my-votes", authenticate, getMyVotesHandler);

/**
 * GET /api/votes/stats
 * Get voting statistics (optional)
 */
router.get("/stats", authenticate, getVoteStatsHandler);

export default router;
