import { Request, Response } from "express";
import { hashPassword, generateJWT } from "../services/authService";
import { sendConfirmationEmail } from "../services/mailerService";
import pool from "../config/db";
import jwt from "jsonwebtoken";

// User registration logic
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    const token = generateJWT({ id: result.rows[0].id, email });

    const confirmationLink = `http://localhost:3000/confirm-email?token=${token}`;
    await sendConfirmationEmail(email, confirmationLink);

    res
      .status(201)
      .json({ message: "User registered, please confirm your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Confirm email logic
export const confirmEmail = async (req: Request, res: Response) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );
    const { email } = decoded as { email: string };

    await pool.query(
      "UPDATE users SET email_confirmed = true WHERE email = $1",
      [email]
    );

    res.status(200).json({ message: "Email confirmed successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
