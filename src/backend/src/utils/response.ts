/**
 * 표준 응답 유틸리티
 */

import { Response } from "express";
import { ApiResponse, PaginatedResponse, PaginationMeta } from "../types/index.js";

/**
 * 성공 응답
 */
export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  data: T,
  message: string = "요청이 완료되었습니다"
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
}

/**
 * 페이지네이션 응답
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
  message: string = "요청이 완료되었습니다"
): Response {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    meta,
  };
  return res.status(200).json(response);
}

/**
 * 에러 응답
 */
export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  code: string = "ERROR",
  details?: any
): Response {
  const response: ApiResponse = {
    success: false,
    data: null,
    message,
    timestamp: new Date().toISOString(),
    error: {
      code,
      details,
    },
  };
  return res.status(statusCode).json(response);
}

/**
 * 검증 에러 응답
 */
export function sendValidationError(
  res: Response,
  details: Record<string, string>
): Response {
  return sendError(
    res,
    422,
    "입력 검증 실패",
    "VALIDATION_ERROR",
    details
  );
}

/**
 * 없음 에러 응답
 */
export function sendNotFound(
  res: Response,
  message: string = "요청한 리소스를 찾을 수 없습니다"
): Response {
  return sendError(res, 404, message, "NOT_FOUND");
}

/**
 * 서버 에러 응답
 */
export function sendServerError(
  res: Response,
  error?: any
): Response {
  console.error("Server Error:", error);
  return sendError(
    res,
    500,
    "서버 오류가 발생했습니다",
    "SERVER_ERROR"
  );
}
