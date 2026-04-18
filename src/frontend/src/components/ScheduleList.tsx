/**
 * 일정 목록 컴포넌트
 */

import React from "react";
import { Schedule, ScheduleStatus, Priority } from "../types/index.js";

interface ScheduleListProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
  isLoading?: boolean;
}

const getStatusBadgeColor = (status: ScheduleStatus): string => {
  switch (status) {
    case ScheduleStatus.PLAN:
      return "badge-yellow";
    case ScheduleStatus.IN_PROGRESS:
      return "badge-blue";
    case ScheduleStatus.COMPLETED:
      return "badge-green";
    default:
      return "badge-gray";
  }
};

const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case Priority.LOW:
      return "text-green-600";
    case Priority.MEDIUM:
      return "text-yellow-600";
    case Priority.HIGH:
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getPriorityLabel = (priority: Priority): string => {
  switch (priority) {
    case Priority.LOW:
      return "낮음";
    case Priority.MEDIUM:
      return "중간";
    case Priority.HIGH:
      return "높음";
    default:
      return priority;
  }
};

const getStatusLabel = (status: ScheduleStatus): string => {
  switch (status) {
    case ScheduleStatus.PLAN:
      return "계획";
    case ScheduleStatus.IN_PROGRESS:
      return "진행중";
    case ScheduleStatus.COMPLETED:
      return "완료";
    default:
      return status;
  }
};

const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  return (
    <div className="space-y-3">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                {schedule.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {schedule.description}
              </p>
            </div>
            <span className={`badge ${getStatusBadgeColor(schedule.status)}`}>
              {getStatusLabel(schedule.status)}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3 text-sm">
            <span className="text-gray-500">
              📅 {new Date(schedule.startDate).toLocaleDateString("ko-KR")}
            </span>
            <span className={`font-medium ${getPriorityColor(schedule.priority)}`}>
              ⭐ {getPriorityLabel(schedule.priority)}
            </span>
          </div>

          {schedule.prompt && (
            <div className="bg-white p-2 rounded text-xs text-gray-700 mb-3 max-h-20 overflow-y-auto">
              <p className="font-medium mb-1">프롬프트:</p>
              <p className="text-gray-600">{schedule.prompt.substring(0, 100)}...</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(schedule)}
              disabled={isLoading}
              className="btn-secondary text-sm px-3 py-1 flex-1"
            >
              ✏️ 수정
            </button>
            <button
              onClick={() => onDelete(schedule)}
              disabled={isLoading}
              className="btn-danger text-sm px-3 py-1 flex-1"
            >
              🗑️ 삭제
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(schedule.prompt);
                alert("프롬프트가 복사되었습니다");
              }}
              className="btn-secondary text-sm px-3 py-1"
            >
              📋
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleList;
