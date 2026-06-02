import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { config } from "../configs/env";
import { logger } from "../utils/logger.util";

let memoryServer: MongoMemoryServer | undefined;

export const connectDb = async (): Promise<void> => {
  try {
    if (process.env.MONGODB_MEMORY_SERVER === "true") {
      memoryServer = await MongoMemoryServer.create({
        instance: { launchTimeout: 60000 },
      });
      logger.warn("Using in-memory MongoDB. Data resets when the server stops.");
    }

    const conn = await mongoose.connect(memoryServer?.getUri() || config.db.uri, {
      autoIndex: config.isDev,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      await memoryServer?.stop();
      logger.info("MongoDB connection closed");
      process.exit(0);
    });
  } catch (error) {
    logger.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
