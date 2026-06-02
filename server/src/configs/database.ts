import mongoose from "mongoose";
import { config } from "./env";
import { logger } from "../utils/logger.util";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(config.db.uri, {
      autoIndex: config.isDev,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDb connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDb disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDb reconnected successfully.");
    });
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed on app termination");
      process.exit(0);
    });
  } catch (e) {
    logger.error("MongoDb connection error:", e);
    process.exit(1);
  }
};
