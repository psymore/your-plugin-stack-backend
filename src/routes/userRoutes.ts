import express from "express";
import { getAllUsers, createUser } from "../controllers/userController";

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     description: Get all users
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     description: Create a new user
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", createUser);

export default router;
