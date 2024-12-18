import express from "express";
import {
  confirmEmail,
  loginUser,
  registerUser,
} from "../controllers/authController";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Internal Server Error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /auth/login:
 *  post:
 *  summary: Login
 * description: Login with email and password
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: Login successful
 * 400:
 * description: Invalid credentials
 * 403:
 * description: Please verify your email first
 * 500:
 * description: Internal Server Error
 */

/**
 * @swagger
 * /auth/confirm-email:
 *  get:
 *   summary: Confirm email
 *  description: Confirm email address
 * parameters:
 *  - in: query
 *   name: token
 *  required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Email verified successfully
 * 400:
 * description: Invalid token or user does not exist
 * 500:
 * description: Internal Server Error
 */
router.get("/confirm-email", confirmEmail);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid password
 *       403:
 *         description: Email not verified
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /auth/logout:
 *  post:
 *  summary: Logout
 * description: Logout user
 * responses:
 * 200:
 * description: Logout successful
 *  500:
 * description: Internal Server Error
 * */
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

export default router;
