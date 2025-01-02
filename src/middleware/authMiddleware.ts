import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import redisClient from "../config/redisClient";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Extract token from headers or cookies
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    // Check if the token is blacklisted in Redis
    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) {
      res.status(403).json({ error: "Token has been revoked" });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).userId = (decoded as { userId: string }).userId; // Attach userId to req

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token has expired" });
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  }
};
