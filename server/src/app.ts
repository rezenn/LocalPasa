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
import siteRoutes from "./routes/site.routes";
import artisanRoutes from "./routes/artisan.routes";
import eventRoutes from "./routes/event.routes";
import savedRoutes from "./routes/saved.routes";
import searchRoutes from "./routes/search.routes";
import profileRoutes from "./routes/profile.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { sanitizeBody } from "./middleware/security.middleware";
import { sendSuccess } from "./utils/response.util";

dotenv.config();
const app: Application = express();

// React Native apps don't send an Origin header (it's null/undefined),
// so we accept null origins (mobile) plus all known web origins.
let corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    const allowed = [
      config.client.url,
      "http://localhost:3000",
      "http://localhost:3003",
      "http://localhost:19006", // Expo web
      "http://localhost:8081", // Metro bundler
    ];
    // React Native mobile apps send no Origin header → origin is undefined
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // allow all in development; tighten in production
    }
  },
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

app.use(
  "/uploads/profile",
  express.static(path.join(__dirname, "../uploads/profile")),
);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req: Request, res: Response) => {
  return sendSuccess(
    res,
    {
      name: "LocalPasa API",
      version: config.apiVersion,
      endpoints: {
        sites: "/api/v1/sites",
        artisans: "/api/v1/artisans",
        events: "/api/v1/events",
        search: "/api/v1/search",
        saved: "/api/v1/saved",
        profile: "/api/v1/profile",
        dashboard: "/api/v1/dashboard",
      },
    },
    "Server is running",
  );
});

app.get("/health", (_req: Request, res: Response) => {
  return sendSuccess(res, { uptime: process.uptime() }, "Healthy");
});

// API Routes
app.use(`/api/${config.apiVersion}/auth`, authRoutes);
app.use(`/api/${config.apiVersion}/sites`, siteRoutes);
app.use(`/api/${config.apiVersion}/artisans`, artisanRoutes);
app.use(`/api/${config.apiVersion}/events`, eventRoutes);
app.use(`/api/${config.apiVersion}/saved`, savedRoutes);
app.use(`/api/${config.apiVersion}/search`, searchRoutes);
app.use(`/api/${config.apiVersion}/profile`, profileRoutes);
app.use(`/api/${config.apiVersion}/dashboard`, dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
