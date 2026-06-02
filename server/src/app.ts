import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { config } from "./configs/env";
import authRoutes from "./routes/auth.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { sanitizeBody } from "./middleware/security.middleware";
import { sendSuccess } from "./utils/response.util";

dotenv.config();
const app: Application = express();

let corsOptions = {
  origin: [config.client.url, "http://localhost:3000", "http://localhost:3003"],
  credentials: true,
};

app.disable("x-powered-by");
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser(config.cookie.secret));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(sanitizeBody);
app.use(hpp());
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

if (config.isDev) {
  app.use(morgan("dev"));
}

app.use("/uploads/profile", express.static(path.join(__dirname, "../uploads/profile")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req: Request, res: Response) => {
  return sendSuccess(res, { name: "LocalPasa API" }, "Server is running");
});

app.get("/health", (_req: Request, res: Response) => {
  return sendSuccess(res, { uptime: process.uptime() }, "Healthy");
});

app.use(`/api/${config.apiVersion}/auth`, authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
