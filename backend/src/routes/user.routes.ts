import { Router } from "express";
import { Request, Response } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { asyncHandler } from "@/middleware/errorHandler";

/**
 * User Routes (Protected)
 *
 * All routes here require authentication
 */

const router = Router();

/**
 * GET /api/user/me
 * Get current user's profile
 * Protected route - requires valid JWT token
 */
router.get(
  "/me",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    // req.user is available because of authenticate middleware
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  }),
);

export default router;
