import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import ApiError from "../utils/apiError";

/**
 * Restricts a route to the given roles. Must run after `authenticate`.
 * Usage: router.post("/", authenticate, authorize("ADMIN", "SALES"), handler)
 */
export const authorize =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to perform this action");
    }
    next();
  };