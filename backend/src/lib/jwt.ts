import * as jwt from "jsonwebtoken";
/**
 * JWT Utility Functions
 *
 * Handles JWT token generation and verification
 */

interface JWTPayload {
  userId: number;
  email: string;
}

/**
 * Type guard to ensure JWT secret is a valid string
 */
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof secret !== "string") {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
}

/**
 * Generate JWT Token
 *
 * Creates a signed JWT token with user data
 */
export const generateToken = (payload: JWTPayload): string => {
  const secret = getJWTSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  // @ts-expect-error - jsonwebtoken types have overload resolution issues with strict TypeScript
  // This is a known issue: string is valid for secret, and expiresIn as string is valid
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT Token
 *
 * Verifies and decodes a JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
  const secret = getJWTSecret();

  try {
    const decoded = jwt.verify(token, secret);
    
    // Type guard to ensure decoded is an object with expected properties
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      "email" in decoded
    ) {
      return decoded as JWTPayload;
    }
    
    throw new Error("Invalid token payload");
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw error;
  }
};
