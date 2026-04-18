/**
 * CORS 설정
 */

import cors from "cors";

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

export const corsOptions = {
  origin: CORS_ORIGIN.split(","),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export const corsMiddleware = cors(corsOptions);
