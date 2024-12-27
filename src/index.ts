import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./docs/swaggerConfig";
import { default as authRoutes } from "./routes/authRoutes";
import { default as pluginRoutes } from "./routes/pluginRoutes";
import { default as userRoutes } from "./routes/userRoutes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies
app.use(
  cors({
    origin: "http://localhost:3001", // Frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Register routes
app.use("/auth", authRoutes);

//User and plugin routes
app.use("/user", userRoutes);
app.use("/plugins", pluginRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
