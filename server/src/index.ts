import app from "./app";
import { config } from "./configs/env";
import { connectDb } from "./database/mongodb";
import { logger } from "./utils/logger.util";

async function startServer() {
  await connectDb();

  app.listen(config.port, () => {
    logger.info(`Server: http://localhost:${config.port}`);
  });
}

startServer().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});
