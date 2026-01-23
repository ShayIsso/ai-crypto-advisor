import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

/**
 * Authentication Middleware
 *
 * Protects routes by verifying JWT tokens from the Authorization header.
 * Attaches authenticated user data to req.user for use in controllers.
 *
 * Usage:
 *   router.get('/protected', authenticate, controller)
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authorization header missing", 401);
    }

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new AppError(
        "Invalid authorization header format. Expected: Bearer <token>",
        401,
      );
    }

    const token = parts[1];

    // 2. Verify and decode token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error: any) {
      throw new AppError(error.message || "Invalid token", 401);
    }

    // 3. Check if user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        preferences: true,
      },
    });

    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    // 4. Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    next(error);
  }
};
