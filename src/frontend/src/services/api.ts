/**
 * API 서비스
 */

import axios, { AxiosInstance } from "axios";
import { Schedule, CreateScheduleInput, SearchFilters } from "../types/index.js";

const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// API 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
);

/**
 * Schedule API
 */
export const scheduleApi = {
  // 모든 일정 조회
  getAll: async (page: number = 1, limit: number = 10) => {
    return await apiClient.get<any, any>("/schedules", {
      params: { page, limit },
    });
  },

  // 일정 검색
  search: async (filters: SearchFilters) => {
    return await apiClient.get<any, any>("/schedules/search", {
      params: filters,
    });
  },

  // 날짜별 일정 조회
  getByDate: async (date: string) => {
    return await apiClient.get<any, any>(`/schedules/date/${date}`);
  },

  // 일정 상세 조회
  getById: async (id: string) => {
    return await apiClient.get<any, any>(`/schedules/${id}`);
  },

  // 일정 생성
  create: async (data: CreateScheduleInput) => {
    return await apiClient.post<any, any>("/schedules", data);
  },

  // 일정 수정
  update: async (id: string, data: Partial<CreateScheduleInput>) => {
    return await apiClient.put<any, any>(`/schedules/${id}`, data);
  },

  // 일정 삭제
  delete: async (id: string) => {
    return await apiClient.delete<any, any>(`/schedules/${id}`);
  },

  // 통계 조회
  getStats: async () => {
    return await apiClient.get<any, any>("/schedules/stats");
  },
};

export default apiClient;
