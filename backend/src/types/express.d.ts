/**
 * Express Type Extensions
 * 
 * Augment Express Request type to include custom properties
 * that we'll add via middleware (like authenticated user data)
 */

import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      /**
       * Authenticated user object (added by auth middleware)
       * Will be undefined for public routes
       */
      user?: {
        id: number;
        email: string;
        name: string;
      };
    }
  }
}

/**
 * Why we need this:
 * 
 * After JWT authentication, we want to do:
 *   req.user = { id: 1, email: "user@example.com", name: "John" }
 * 
 * Without this declaration, TypeScript would error:
 *   "Property 'user' does not exist on type 'Request'"
 * 
 * With this, TypeScript knows about req.user and provides autocomplete!
 */
