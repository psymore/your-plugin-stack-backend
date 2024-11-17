import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
// import swaggerDocs from "./docs/swagger";
import { default as userRoutes } from "./routes/userRoutes";
import { default as pluginRoutes } from "./routes/pluginRoutes";
import { default as authRoutes } from "./routes/authRoutes";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc));

// Register routes
app.use("/users", userRoutes);
app.use("/plugins", pluginRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// import express, { Request, Response } from "express";
// import { Pool } from "pg";
// import dotenv from "dotenv";
// import swaggerUi from "swagger-ui-express";
// import swaggerJsdoc from "swagger-jsdoc";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
// import bcrypt from "bcrypt";

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3002;

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: Number(process.env.DB_PORT),
// });

// app.use(express.json());

// // Swagger set up
// const swaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "My API",
//       version: "1.0.0",
//       description: "API documentation for my project",
//     },
//   },
//   apis: ["./src/index.ts"], // Point to the file(s) where your routes are defined
// };

// const swaggerDocs = swaggerJsdoc(swaggerOptions);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// app.get("/api", async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// //Test route

// /**
//  * @swagger
//  * /api:
//  *   get:
//  *     description: Get the current time from the database
//  *     responses:
//  *       200:
//  *         description: Success
//  */

// app.get("/api", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// // USER ROUTES
// /**
//  * @swagger
//  * /users:
//  *   get:
//  *     description: Get all users
//  *     responses:
//  *       200:
//  *         description: Success
//  */
// app.get("/users", async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query("SELECT * FROM users");
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// /**
//  * @swagger
//  * /users:
//  *   post:
//  *     description: Create a new user
//  *     parameters:
//  *       - name: name
//  *         description: User's name
//  *         in: body
//  *         required: true
//  *         schema:
//  *           type: string
//  *       - name: email
//  *         description: User's email
//  *         in: body
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       201:
//  *         description: Created
//  */
// app.post("/users", async (req: Request, res: Response) => {
//   const { name, email } = req.body;
//   try {
//     const result = await pool.query(
//       "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
//       [name, email]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// // PLUGIN ROUTES

// /**
//  * @swagger
//  * /plugins:
//  *   get:
//  *     description: Get all plugins
//  *     responses:
//  *       200:
//  *         description: Success
//  */
// app.get("/plugins", async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query("SELECT * FROM plugin");
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// /**
//  * @swagger
//  * /plugins:
//  *   post:
//  *     description: Add a new plugin
//  *     parameters:
//  *       - name: plugin_name
//  *         description: Name of the plugin
//  *         in: body
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       201:
//  *         description: Created
//  */
// app.post("/plugins", async (req: Request, res: Response) => {
//   const { plugin_name } = req.body;
//   try {
//     const result = await pool.query(
//       "INSERT INTO plugin (plugin_name) VALUES ($1) RETURNING *",
//       [plugin_name]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// // Mailer configuration
// const transporter = nodemailer.createTransport({
//   host: process.env.MAILER_HOST,
//   port: Number(process.env.MAILER_PORT),
//   auth: {
//     user: process.env.MAILER_USER,
//     pass: process.env.MAILER_PASSWORD,
//   },
// });

// // JWT secret
// const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

// // User Registration
// app.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save user to the database
//     const result = await pool.query(
//       "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
//       [name, email, hashedPassword]
//     );

//     // Generate JWT token
//     const token = jwt.sign({ id: result.rows[0].id, email }, jwtSecret, {
//       expiresIn: "1h",
//     });

//     // Send email with confirmation link
//     const confirmationLink = `http://localhost:3000/confirm-email?token=${token}`;
//     await transporter.sendMail({
//       from: process.env.MAILER_USER,
//       to: email,
//       subject: "Email Confirmation",
//       text: `Please confirm your email by clicking this link: ${confirmationLink}`,
//     });

//     res
//       .status(201)
//       .json({ message: "User registered, please confirm your email" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Email Confirmation
// app.get("/confirm-email", async (req, res) => {
//   const { token } = req.query;

//   try {
//     const decoded = jwt.verify(token as string, jwtSecret);
//     const { email } = decoded as { email: string };

//     // Activate the user by confirming the email in the database
//     await pool.query(
//       "UPDATE users SET email_confirmed = true WHERE email = $1",
//       [email]
//     );

//     res.status(200).json({ message: "Email confirmed successfully" });
//   } catch (error) {
//     res.status(400).json({ error: "Invalid or expired token" });
//   }
// });

// // // User Login
// // app.post("/login", async (req, res) => {
// //   const { email, password } = req.body;

// //   try {
// //     const result = await pool.query("SELECT * FROM users WHERE email = $1", [
// //       email,
// //     ]);

// //     if (result.rows.length === 0) {
// //       return res.status(400).json({ error: "User not found" });
// //     }

// //     const user = result.rows[0];

// //     // Check if password is correct
// //     const passwordMatch = await bcrypt.compare(password, user.password);

// //     if (!passwordMatch) {
// //       return res.status(400).json({ error: "Invalid credentials" });
// //     }

// //     // Generate JWT
// //     const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
// //       expiresIn: "1h",
// //     });

// //     res.json({ token });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
