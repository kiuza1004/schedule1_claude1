/**
 * Zustand 상태 관리
 */

import { create } from "zustand";
import { Schedule, SearchFilters } from "../types/index.js";

export interface ScheduleStore {
  // 상태
  schedules: Schedule[];
  selectedDate: Date | null;
  searchQuery: string;
  filters: SearchFilters;
  isLoading: boolean;
  error: string | null;

  // 액션
  setSchedules: (schedules: Schedule[]) => void;
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, data: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  setSelectedDate: (date: Date | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // 계산된 상태
  filteredSchedules: () => Schedule[];
  schedulesByDate: () => Map<string, Schedule[]>;
}

const initialState = {
  schedules: [],
  selectedDate: null,
  searchQuery: "",
  filters: {},
  isLoading: false,
  error: null,
};

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  ...initialState,

  // 액션
  setSchedules: (schedules: Schedule[]) => set({ schedules }),
  addSchedule: (schedule: Schedule) =>
    set((state) => ({
      schedules: [schedule, ...state.schedules],
    })),
  updateSchedule: (id: string, data: Partial<Schedule>) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    })),
  deleteSchedule: (id: string) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== id),
    })),
  setSelectedDate: (date: Date | null) => set({ selectedDate: date }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setFilters: (filters: SearchFilters) => set({ filters }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  reset: () => set(initialState),

  // 계산된 상태
  filteredSchedules: () => {
    const state = get();
    let filtered = state.schedules;

    // 키워드로 필터링
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.prompt.toLowerCase().includes(query)
      );
    }

    // 상태로 필터링
    if (state.filters.status && state.filters.status.length > 0) {
      filtered = filtered.filter((s) =>
        state.filters.status?.includes(s.status)
      );
    }

    // 우선순위로 필터링
    if (state.filters.priority && state.filters.priority.length > 0) {
      filtered = filtered.filter((s) =>
        state.filters.priority?.includes(s.priority)
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  },

  schedulesByDate: () => {
    const schedules = get().schedules;
    const map = new Map<string, Schedule[]>();

    schedules.forEach((schedule) => {
      const date = new Date(schedule.startDate).toISOString().split("T")[0];
      if (!map.has(date)) {
        map.set(date, []);
      }
      map.get(date)!.push(schedule);
    });

    return map;
  },
}));
