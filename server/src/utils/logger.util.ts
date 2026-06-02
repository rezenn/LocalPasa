import winston from "winston";
import path from "path";
import { config } from "../configs/env";

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const developmentFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  simple(),
);

const productionFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
  level: config.isDev ? "debug" : "info",
  format: config.isProd ? productionFormat : developmentFormat,
  transports: [
    new winston.transports.Console(),
    ...(config.isProd
      ? [
          new winston.transports.File({
            filename: path.join("logs", "error.log"),
            level: "error",
          }),
          new winston.transports.File({
            filename: path.join("logs", "combined.log"),
          }),
        ]
      : []),
  ],
  exitOnError: false,
});
