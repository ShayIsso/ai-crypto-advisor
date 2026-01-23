// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { asyncHandler } from "@/middleware/errorHandler";
import { registerUser, loginUser } from "@/services/auth.service";
import type { RegisterInput, LoginInput } from "@/schemas/auth.schema";

/**
 * Register Handler
 * POST /api/auth/register
 */
export const registerHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { user, token } = await registerUser(req.body as RegisterInput);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user, token },
    });
  },
);

/**
 * Login Handler
 * POST /api/auth/login
 */
export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { user, token } = await loginUser(req.body as LoginInput);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user, token },
    });
  },
);
