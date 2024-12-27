// src/config/redisClient.ts
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", err => console.error("Redis Client Error", err));

const MAX_RETRIES = 5;
let retries = 0;

const connectWithRetry = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    retries += 1;
    console.error(`Redis connection attempt ${retries} failed:`, err);
    if (retries < MAX_RETRIES) {
      setTimeout(connectWithRetry, 1000); // Retry after 1 second
    } else {
      console.error("Max retries reached. Could not connect to Redis.");
    }
  }
};

connectWithRetry();

process.on("unhandledRejection", error => {
  console.error("Unhandled promise rejection:", error);
});

export default redisClient;
