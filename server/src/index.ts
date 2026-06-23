import app from "./app";
import { config } from "./configs/env";
import { connectDb } from "./database/mongodb";
import { logger } from "./utils/logger.util";

async function startServer() {
  await connectDb();

  app.listen(config.port, "0.0.0.0", () => {
    logger.info(`Server: http://0.0.0.0:${config.port}`);
    logger.info(`LAN:    http://192.168.101.6:${config.port}`);
  });
}

startServer().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});
