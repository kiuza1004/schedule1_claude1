/**
 * 공통 타입 정의
 */

// API 응답 형식
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  timestamp: string;
  error?: {
    code: string;
    details?: any;
  };
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Schedule 타입
export enum ScheduleStatusEnum {
  PLAN = "plan",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum PriorityEnum {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface Schedule {
  id: string;
  title: string;
  description: string;
  prompt: string;
  startDate: string;
  status: ScheduleStatusEnum;
  priority: PriorityEnum;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleCreateInput {
  title: string;
  description: string;
  prompt: string;
  startDate: string;
  status?: ScheduleStatusEnum;
  priority?: PriorityEnum;
  tags?: string[];
}

export interface ScheduleUpdateInput {
  title?: string;
  description?: string;
  prompt?: string;
  startDate?: string;
  status?: ScheduleStatusEnum;
  priority?: PriorityEnum;
  tags?: string[];
}

// 쿼리 파라미터
export interface ScheduleQueryParams {
  page?: number;
  limit?: number;
  sort?: "date" | "priority" | "status";
  order?: "asc" | "desc";
  q?: string;
  status?: ScheduleStatusEnum;
  priority?: PriorityEnum;
  startDate?: string;
  endDate?: string;
}

// 검색 결과
export interface SearchResult {
  count: number;
  query: string;
  filters?: Partial<ScheduleQueryParams>;
}

// 통계
export interface ScheduleStats {
  total: number;
  byStatus: {
    plan: number;
    in_progress: number;
    completed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  thisMonth: number;
  thisWeek: number;
  today: number;
}
