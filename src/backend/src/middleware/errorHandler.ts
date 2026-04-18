/**
 * 에러 핸들링 미들웨어
 */

import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";
import { sendError } from "../utils/response.js";
import { ValidationError } from "../utils/validation.js";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * 에러 핸들러 미들웨어
 */
export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error("Error occurred", {
    path: req.path,
    method: req.method,
    error: error.message,
    stack: error.stack,
  });

  if (error instanceof ValidationError) {
    sendError(res, 422, error.message, "VALIDATION_ERROR", error.details);
    return;
  }

  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.message, error.code, error.details);
    return;
  }

  // 예상치 못한 에러
  sendError(res, 500, "서버 오류가 발생했습니다", "SERVER_ERROR");
}

/**
 * 404 핸들러
 */
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const error = new AppError(
    404,
    "NOT_FOUND",
    `${req.method} ${req.path}를 찾을 수 없습니다`
  );
  next(error);
}
