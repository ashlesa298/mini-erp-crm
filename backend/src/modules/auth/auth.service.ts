import bcrypt from "bcryptjs";
import prisma from "../../config/database";
import { signToken } from "../../utils/jwt";

export const loginUser = async (
  email: string,
  password: string
) => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase().trim(),
    },
  });

  // User not found
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  // Return login data
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};