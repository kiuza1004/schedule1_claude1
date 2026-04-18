/**
 * Frontend 타입 정의
 */

export enum ScheduleStatus {
  PLAN = "plan",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum Priority {
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
  status: ScheduleStatus;
  priority: Priority;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleInput {
  title: string;
  description: string;
  prompt: string;
  startDate: string;
  status?: ScheduleStatus;
  priority?: Priority;
  tags?: string[];
}

export interface SearchFilters {
  q?: string;
  status?: ScheduleStatus[];
  priority?: Priority[];
  startDate?: string;
  endDate?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
