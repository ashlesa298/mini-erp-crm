import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";
import { verifyToken } from "../utils/jwt";
import asyncHandler from "../utils/asyncHandler";
import prisma from "../config/database";

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication token is missing");
    }

    const token = header.split(" ")[1];

    let payload;

    try {
      payload = verifyToken(token);
    } catch {
      throw new ApiError(401, "Invalid or expired token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  }
);