import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/db";
import redisClient from "../config/redisClient";
import { decodedJWT, generateJWT, hashPassword } from "../services/authService";
import { sendConfirmationEmail } from "../services/mailerService";
import { prisma } from "../prisma";

// Register User
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate unique transaction ID for Redis
    const transactionId = uuidv4();

    // Store user info temporarily in Redis
    await redisClient.set(
      `transaction:${transactionId}`,
      JSON.stringify({ name, email, password: hashedPassword }),
      {
        EX: 3600, // Set expiry to 1 hour (3600 seconds)
      }
    );

    // Generate JWT with the transaction ID
    const verificationToken = generateJWT({ transactionId });

    const confirmationLink = `${process.env.FRONTEND_BASE_URL}/confirm-email?token=${verificationToken}`;

    // Send confirmation email with the verification link
    await sendConfirmationEmail(email, confirmationLink);

    // Respond with success
    res.status(201).json({
      message: "User registered. Please check your email for verification.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Confirm Email
export const confirmEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.query;

  try {
    // Verify JWT and extract the transaction ID
    const decoded = decodedJWT(token as string);
    const transactionId = (decoded as jwt.JwtPayload).transactionId;

    // Retrieve user data from Redis using the transaction ID
    const userData = await redisClient.get(`transaction:${transactionId}`);

    if (!userData) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }

    const { name, email, password } = JSON.parse(userData);

    // Insert the user into the database with `is_verified = true`
    const newUser = await prisma.user.create({
      data: {
        name: "name",
        email,
        password,
        is_verified: true,
      },
    });

    // Delete the transaction from Redis
    await redisClient.del(`transaction:${transactionId}`);

    res
      .status(200)
      .json({ message: "Email verified successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Invalid or expired token" });
  }
};

// Login User (enhanced with Redis and Cookie-based JWT)
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    // Fetch user from the database
    const isUserRegistered = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!isUserRegistered) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = isUserRegistered;

    // Check if the email is verified
    if (!user?.is_verified) {
      res.status(403).json({ error: "Please verify your email first" });
      return;
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    // Check if the user is already logged in by checking if their token exists in Redis
    const existingToken = await redisClient.get(user.id.toString());

    if (existingToken) {
      res.status(400).json({ message: "User is already logged in" });
      return;
    }

    // Generate JWT
    const token = generateJWT({ userId: user.id });

    // Store the token in Redis with an expiry (optional)
    await redisClient.set(token, user.id, { EX: 3600 }); // 1 hour expiration

    // Also store the user id with the token in Redis for checking later
    await redisClient.set(user.id.toString(), token, { EX: 3600 }); // 1 hour expiration for user session

    // Set the JWT in HttpOnly cookie
    const cookie = serialize("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);

    // Respond with success message
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }

  next();
};

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies["auth-token"]; // Get token from cookies

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    // Blacklist the token by storing it in Redis with a short expiry
    await redisClient.set(token, "blacklisted", { EX: 3600 }); // 1 hour expiration

    // Clear the cookie
    res.setHeader(
      "Set-Cookie",
      serialize("auth-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0, // Expire immediately
        sameSite: "strict",
        path: "/",
      })
    );

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
