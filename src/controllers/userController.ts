import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import pool from "../config/db";
import { sendConfirmationEmail } from "../services/mailerService";
import { User } from "../models/user-model";

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// Register User with email verification
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const result = await pool.query(
      "INSERT INTO users (name, email, password, verification_token) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, verificationToken]
    );

    const verificationLink = `${process.env.FRONTEND_BASE_URL}/verify-email?token=${verificationToken}`;

    // Send confirmation email
    await sendConfirmationEmail(email, verificationLink);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Verify email
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.query;

  try {
    const result = await pool.query(
      "UPDATE users SET is_verified = true, verification_token = null WHERE verification_token = $1 RETURNING *",
      [token]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login User with email verification check
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction // Add next for middleware compatibility if needed
): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = result.rows[0];

    // Check if the email is verified
    if (!user.is_verified) {
      res.status(403).json({ error: "Please verify your email first" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  next();
};
