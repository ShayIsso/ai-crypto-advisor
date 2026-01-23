import { Router } from "express";
import { registerHandler, loginHandler } from "@/controllers/auth.controller";
import { validate } from "@/middleware/validate.middleware";
import { registerSchema, loginSchema } from "@/schemas/auth.schema";

/**
 * Authentication Routes
 *
 * /api/auth/register - Register new user
 * /api/auth/login    - Login existing user
 */

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user account
 *
 * Body: { email, name, password }
 */
router.post("/register", validate(registerSchema), registerHandler);

/**
 * POST /api/auth/login
 * Login with email and password
 *
 * Body: { email, password }
 */
router.post("/login", validate(loginSchema), loginHandler);

export default router;  