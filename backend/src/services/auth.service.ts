// src/services/auth.service.ts
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/middleware/errorHandler";
import { generateToken } from "@/lib/jwt";
import type { RegisterInput, LoginInput } from "@/schemas/auth.schema";

/**
 * Register a new user
 */
export const registerUser = async (data: RegisterInput) => {
  const { email, name, password } = data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return { user, token };
};

/**
 * Authenticate a user
 */
export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      preferences: user.preferences,
    },
    token,
  };
};
