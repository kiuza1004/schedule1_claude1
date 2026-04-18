/**
 * 입력 검증 스키마
 */

import Joi from "joi";
import {
  ScheduleStatusEnum,
  PriorityEnum,
  ScheduleCreateInput,
  ScheduleUpdateInput,
} from "../types/index.js";

// 상태 검증
const statusSchema = Joi.string().valid(
  ScheduleStatusEnum.PLAN,
  ScheduleStatusEnum.IN_PROGRESS,
  ScheduleStatusEnum.COMPLETED
);

// 우선순위 검증
const prioritySchema = Joi.string().valid(
  PriorityEnum.LOW,
  PriorityEnum.MEDIUM,
  PriorityEnum.HIGH
);

// Schedule 생성 스키마
export const createScheduleSchema = Joi.object<ScheduleCreateInput>({
  title: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.empty": "타이틀은 필수입니다",
      "string.max": "타이틀은 100자 이하여야 합니다",
    }),
  description: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .messages({
      "string.empty": "설명은 필수입니다",
      "string.max": "설명은 1000자 이하여야 합니다",
    }),
  prompt: Joi.string()
    .min(1)
    .max(5000)
    .required()
    .messages({
      "string.empty": "프롬프트는 필수입니다",
      "string.max": "프롬프트는 5000자 이하여야 합니다",
    }),
  startDate: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "유효한 날짜 형식이 아닙니다",
      "any.required": "시작 날짜는 필수입니다",
    }),
  status: statusSchema.default(ScheduleStatusEnum.PLAN),
  priority: prioritySchema.default(PriorityEnum.MEDIUM),
  tags: Joi.array().items(Joi.string()).max(10).optional(),
});

// Schedule 수정 스키마
export const updateScheduleSchema = Joi.object<ScheduleUpdateInput>({
  title: Joi.string().min(1).max(100).optional(),
  description: Joi.string().min(1).max(1000).optional(),
  prompt: Joi.string().min(1).max(5000).optional(),
  startDate: Joi.date().iso().optional(),
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  tags: Joi.array().items(Joi.string()).max(10).optional(),
});

// 검색 쿼리 검증
export const searchQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string()
    .valid("date", "priority", "status")
    .default("date"),
  order: Joi.string().valid("asc", "desc").default("desc"),
  q: Joi.string().max(100).optional(),
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
});

// 날짜 검증
export const dateParamSchema = Joi.object({
  date: Joi.date().iso().required(),
});

// ID 검증
export const idParamSchema = Joi.object({
  id: Joi.string().required(),
});

/**
 * 검증 함수
 */
export async function validateScheduleCreate(
  data: unknown
): Promise<ScheduleCreateInput> {
  try {
    return await createScheduleSchema.validateAsync(data, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      const details: Record<string, string> = {};
      error.details.forEach((detail) => {
        const key = detail.path.join(".");
        details[key] = detail.message;
      });
      throw new ValidationError("입력 검증 실패", details);
    }
    throw error;
  }
}

export async function validateScheduleUpdate(
  data: unknown
): Promise<ScheduleUpdateInput> {
  try {
    return await updateScheduleSchema.validateAsync(data, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      const details: Record<string, string> = {};
      error.details.forEach((detail) => {
        const key = detail.path.join(".");
        details[key] = detail.message;
      });
      throw new ValidationError("입력 검증 실패", details);
    }
    throw error;
  }
}

export async function validateSearchQuery(data: unknown): Promise<any> {
  try {
    return await searchQuerySchema.validateAsync(data, {
      stripUnknown: true,
    });
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      throw new ValidationError("쿼리 검증 실패", error.message);
    }
    throw error;
  }
}

/**
 * 커스텀 에러 클래스
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public details: any = null
  ) {
    super(message);
    this.name = "ValidationError";
  }
}
