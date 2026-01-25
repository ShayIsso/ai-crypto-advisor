import { Request, Response, NextFunction } from "express";

/**
 * Custom Error Class with HTTP Status Code
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguish operational errors from programming errors

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handler Middleware
 *
 * Catches all errors thrown in the application and sends
 * a consistent JSON response to the client.
 *
 * Usage in controllers:
 *   throw new AppError("User not found", 404);
 *   next(new AppError("Invalid credentials", 401));
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Default to 500 Internal Server Error
  let statusCode = 500;
  let message = "Internal server error";

  // If it's our custom AppError, use its properties
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.message) {
    // Generic error with a message
    message = err.message;
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", {
      statusCode,
      message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Send JSON response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Async Handler Wrapper
 *
 * Wraps async route handlers to automatically catch errors
 * and pass them to the error handler middleware.
 *
 * Without this, you'd need try/catch in every async route.
 *
 * Usage:
 *   router.get('/users', asyncHandler(async (req, res) => {
 *     const users = await prisma.user.findMany();
 *     res.json(users);
 *   }));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
