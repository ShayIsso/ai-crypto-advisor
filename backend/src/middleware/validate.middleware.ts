import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";

/**
 * Validation Middleware Factory
 *
 * Creates a middleware that validates request body against a Zod schema
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), registerHandler)
 */
export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate and parse the request body
      // This will transform the data (trim, toLowerCase, etc.) and validate types
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        // Extract validation error messages
        const errors =
          error.issues?.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
          })) || [];

        // Return 400 Bad Request with validation errors
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      // If it's not a Zod error, pass to error handler
      next(error);
    }
  };
};
