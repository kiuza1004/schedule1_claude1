/**
 * 검색 컴포넌트
 */

import React, { useState } from "react";
import { ScheduleStatus, Priority, SearchFilters } from "../types/index.js";

interface SearchProps {
  onSearch: (filters: SearchFilters) => void;
  onFilter: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

const Search: React.FC<SearchProps> = ({ onSearch, onFilter, isLoading = false }) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ ...filters, q: query });
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    setQuery("");
    setFilters({});
    onFilter({});
  };

  const handleStatusToggle = (status: ScheduleStatus) => {
    const currentStatus = filters.status || [];
    const newStatus = currentStatus.includes(status)
      ? currentStatus.filter((s) => s !== status)
      : [...currentStatus, status];
    handleFilterChange("status", newStatus);
  };

  const handlePriorityToggle = (priority: Priority) => {
    const currentPriority = filters.priority || [];
    const newPriority = currentPriority.includes(priority)
      ? currentPriority.filter((p) => p !== priority)
      : [...currentPriority, priority];
    handleFilterChange("priority", newPriority);
  };

  return (
    <div className="card p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">🔍 검색 및 필터</h3>

      {/* 검색창 */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input flex-1"
            placeholder="키워드로 검색..."
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? "검색 중..." : "검색"}
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            ⚙️ {showFilters ? "필터 닫기" : "필터 열기"}
          </button>
        </div>
      </form>

      {/* 필터 패널 */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          {/* 상태 필터 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              상태
            </label>
            <div className="flex flex-wrap gap-2">
              {[ScheduleStatus.PLAN, ScheduleStatus.IN_PROGRESS, ScheduleStatus.COMPLETED].map(
                (status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(filters.status || []).includes(status)}
                      onChange={() => handleStatusToggle(status)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">
                      {status === ScheduleStatus.PLAN && "계획"}
                      {status === ScheduleStatus.IN_PROGRESS && "진행중"}
                      {status === ScheduleStatus.COMPLETED && "완료"}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* 우선순위 필터 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              우선순위
            </label>
            <div className="flex flex-wrap gap-2">
              {[Priority.LOW, Priority.MEDIUM, Priority.HIGH].map((priority) => (
                <label
                  key={priority}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(filters.priority || []).includes(priority)}
                    onChange={() => handlePriorityToggle(priority)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">
                    {priority === Priority.LOW && "낮음"}
                    {priority === Priority.MEDIUM && "중간"}
                    {priority === Priority.HIGH && "높음"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 날짜 범위 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="startDate" className="text-sm font-medium text-gray-700 block mb-1">
                시작 날짜
              </label>
              <input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="text-sm font-medium text-gray-700 block mb-1">
                종료 날짜
              </label>
              <input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* 필터 리셋 */}
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary w-full"
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
