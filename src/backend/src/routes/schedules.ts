/**
 * Schedule 라우트 - REST API 엔드포인트
 */

import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import {
  validateScheduleCreate,
  validateScheduleUpdate,
  validateSearchQuery,
} from "../utils/validation.js";
import {
  sendSuccess,
  sendPaginated,
  sendNotFound,
} from "../utils/response.js";
import { logger } from "../utils/logger.js";
import {
  ScheduleStatusEnum,
  PriorityEnum,
  ScheduleStats,
} from "../types/index.js";

const router = Router();
const prisma = new PrismaClient();

// ============================================
// 헬퍼 함수
// ============================================

function formatSchedule(schedule: any) {
  return {
    id: schedule.id,
    title: schedule.title,
    description: schedule.description,
    prompt: schedule.prompt,
    startDate: schedule.startDate.toISOString().split("T")[0],
    status: schedule.status,
    priority: schedule.priority,
    tags: schedule.tags ? JSON.parse(schedule.tags) : null,
    createdAt: schedule.createdAt.toISOString(),
    updatedAt: schedule.updatedAt.toISOString(),
  };
}

// ============================================
// 1. POST /schedules - 일정 생성
// ============================================

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = await validateScheduleCreate(req.body);

    const schedule = await prisma.schedule.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        prompt: validatedData.prompt,
        startDate: new Date(validatedData.startDate),
        status: validatedData.status || ScheduleStatusEnum.PLAN,
        priority: validatedData.priority || PriorityEnum.MEDIUM,
        tags: validatedData.tags
          ? JSON.stringify(validatedData.tags)
          : null,
      },
    });

    logger.info("일정 생성", { id: schedule.id, title: schedule.title });
    sendSuccess(res, 201, formatSchedule(schedule), "일정이 생성되었습니다");
  } catch (error) {
    next(error);
  }
});

// ============================================
// 2. GET /schedules - 모든 일정 조회 (페이지네이션)
// ============================================

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = await validateSearchQuery(req.query);
    const { page, limit, sort, order } = params;

    const skip = (page - 1) * limit;

    // 정렬 옵션
    const orderBy: any = {};
    if (sort === "date") {
      orderBy.startDate = order;
    } else if (sort === "priority") {
      orderBy._relevance = { search: "", sort: order };
    } else if (sort === "status") {
      orderBy.status = order;
    } else {
      orderBy.startDate = order;
    }

    // 데이터 조회
    const [schedules, total] = await Promise.all([
      prisma.schedule.findMany({
        skip,
        take: limit,
        orderBy: { startDate: order === "asc" ? "asc" : "desc" },
      }),
      prisma.schedule.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const meta = { page, limit, total, totalPages };

    logger.info("일정 목록 조회", { page, limit, total });
    sendPaginated(
      res,
      schedules.map(formatSchedule),
      meta
    );
  } catch (error) {
    next(error);
  }
});

// ============================================
// 3. GET /schedules/:id - 특정 일정 조회
// ============================================

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      sendNotFound(res, "일정을 찾을 수 없습니다");
      return;
    }

    logger.info("일정 상세 조회", { id });
    sendSuccess(res, 200, formatSchedule(schedule), "일정을 조회했습니다");
  } catch (error) {
    next(error);
  }
});

// ============================================
// 4. GET /schedules/search - 일정 검색
// ============================================

router.get("/search/query", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = await validateSearchQuery(req.query);
    const { q, status, priority, startDate, endDate, page = 1, limit = 10 } = params;

    const skip = (page - 1) * limit;
    const where: any = {};

    // 검색어
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { prompt: { contains: q, mode: "insensitive" } },
      ];
    }

    // 상태 필터
    if (status) {
      where.status = status;
    }

    // 우선순위 필터
    if (priority) {
      where.priority = priority;
    }

    // 날짜 범위
    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) {
        where.startDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.startDate.lte = new Date(endDate);
      }
    }

    const [schedules, count] = await Promise.all([
      prisma.schedule.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: "desc" },
      }),
      prisma.schedule.count({ where }),
    ]);

    logger.info("일정 검색", { q, count });
    const response = {
      success: true,
      data: schedules.map(formatSchedule),
      meta: {
        count,
        query: q,
        filters: { status, priority, startDate, endDate },
      },
      message: "검색이 완료되었습니다",
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// ============================================
// 5. GET /schedules/date/:date - 날짜별 일정 조회
// ============================================

router.get("/date/:date", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const schedules = await prisma.schedule.findMany({
      where: {
        startDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { priority: "desc" },
    });

    logger.info("날짜별 일정 조회", { date, count: schedules.length });
    const response = {
      success: true,
      data: schedules.map(formatSchedule),
      meta: {
        date,
        count: schedules.length,
      },
      message: "날짜별 일정을 조회했습니다",
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// ============================================
// 6. PUT /schedules/:id - 일정 수정
// ============================================

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = await validateScheduleUpdate(req.body);

    // 기존 일정 확인
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!existingSchedule) {
      sendNotFound(res, "일정을 찾을 수 없습니다");
      return;
    }

    // 수정
    const updateData: any = {
      ...validatedData,
    };

    if (validatedData.startDate) {
      updateData.startDate = new Date(validatedData.startDate);
    }

    if (validatedData.tags) {
      updateData.tags = JSON.stringify(validatedData.tags);
    }

    const schedule = await prisma.schedule.update({
      where: { id },
      data: updateData,
    });

    logger.info("일정 수정", { id, title: schedule.title });
    sendSuccess(res, 200, formatSchedule(schedule), "일정이 수정되었습니다");
  } catch (error) {
    next(error);
  }
});

// ============================================
// 7. DELETE /schedules/:id - 일정 삭제
// ============================================

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      sendNotFound(res, "일정을 찾을 수 없습니다");
      return;
    }

    await prisma.schedule.delete({
      where: { id },
    });

    logger.info("일정 삭제", { id, title: schedule.title });
    sendSuccess(res, 204, null, "일정이 삭제되었습니다");
  } catch (error) {
    next(error);
  }
});

// ============================================
// 8. GET /schedules/stats - 통계 조회
// ============================================

router.get("/stats/overview", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      total,
      byStatus,
      byPriority,
      thisMonth,
      thisWeek,
      todayCount,
    ] = await Promise.all([
      prisma.schedule.count(),
      prisma.schedule.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.schedule.groupBy({
        by: ["priority"],
        _count: true,
      }),
      prisma.schedule.count({
        where: {
          startDate: {
            gte: startOfMonth,
          },
        },
      }),
      prisma.schedule.count({
        where: {
          startDate: {
            gte: startOfWeek,
          },
        },
      }),
      prisma.schedule.count({
        where: {
          startDate: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    const stats: ScheduleStats = {
      total,
      byStatus: {
        plan: byStatus.find((s: any) => s.status === "plan")?._count || 0,
        in_progress:
          byStatus.find((s: any) => s.status === "in_progress")?._count || 0,
        completed: byStatus.find((s: any) => s.status === "completed")?._count || 0,
      },
      byPriority: {
        low: byPriority.find((p: any) => p.priority === "low")?._count || 0,
        medium: byPriority.find((p: any) => p.priority === "medium")?._count || 0,
        high: byPriority.find((p: any) => p.priority === "high")?._count || 0,
      },
      thisMonth,
      thisWeek,
      today: todayCount,
    };

    logger.info("통계 조회", stats);
    sendSuccess(res, 200, stats, "통계를 조회했습니다");
  } catch (error) {
    next(error);
  }
});

export default router;
