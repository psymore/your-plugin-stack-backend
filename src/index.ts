import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./docs/swaggerConfig";
import { default as authRoutes } from "./routes/authRoutes";
import { default as pluginRoutes } from "./routes/pluginRoutes";
import { default as userRoutes } from "./routes/userRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Register routes
app.use("/users", userRoutes);
app.use("/plugins", pluginRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
