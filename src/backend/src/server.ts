/**
 * Express 서버 설정
 */

import express, { Request, Response, NextFunction } from "express";
import { corsMiddleware } from "./middleware/cors.js";
import {
  errorHandler,
  notFoundHandler,
  AppError,
} from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";
import { sendSuccess } from "./utils/response.js";

// 라우터 임포트
import scheduleRoutes from './routes/schedules.js';

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "localhost";

// ============================================
// 미들웨어
// ============================================

// CORS
app.use(corsMiddleware);

// JSON 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
  });
  next();
});

// ============================================
// 라우트
// ============================================

// 헬스 체크
app.get("/health", (req: Request, res: Response) => {
  sendSuccess(res, 200, { status: "ok" }, "서버가 정상 작동 중입니다");
});

// API 라우트
app.use('/api/schedules', scheduleRoutes);

// ============================================
// 에러 핸들링
// ============================================

// 404 핸들러
app.use(notFoundHandler);

// 에러 핸들러 (마지막)
app.use(errorHandler);

// ============================================
// 서버 시작
// ============================================

async function startServer() {
  try {
    app.listen(PORT, HOST, () => {
      logger.info(`✅ 서버가 시작되었습니다`, {
        url: `http://${HOST}:${PORT}`,
        env: process.env.NODE_ENV,
      });
    });
  } catch (error) {
    logger.error("❌ 서버 시작 실패", error);
    process.exit(1);
  }
}

// SIGTERM 시그널 핸들링
process.on("SIGTERM", () => {
  logger.info("SIGTERM 신호 받음, 서버 종료 중...");
  process.exit(0);
});

// 예상치 못한 에러 핸들링
process.on("uncaughtException", (error) => {
  logger.error("예상치 못한 에러", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("처리되지 않은 Promise rejection", reason);
  process.exit(1);
});

startServer();

export default app;
