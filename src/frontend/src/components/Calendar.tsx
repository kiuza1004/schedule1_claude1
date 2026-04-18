/**
 * 달력 컴포넌트
 */

import React, { useState } from "react";

interface CalendarProps {
  events: Map<string, number>;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onDateSelect,
  selectedDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const goToPreviousMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthName = currentDate.toLocaleString("ko-KR", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="card p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className="btn-secondary px-3 py-1"
            title="이전 달"
          >
            ◀
          </button>
          <button
            onClick={goToNextMonth}
            className="btn-secondary px-3 py-1"
            title="다음 달"
          >
            ▶
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center font-bold text-gray-700 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          );
          const dateStr = formatDate(date);
          const eventCount = events.get(dateStr) || 0;
          const isSelected =
            selectedDate &&
            formatDate(selectedDate) === dateStr;
          const isToday =
            formatDate(new Date()) === dateStr;

          return (
            <button
              key={day}
              onClick={() => onDateSelect(date)}
              className={`
                aspect-square rounded-lg p-2 transition-all
                flex flex-col items-center justify-center
                ${
                  isSelected
                    ? "bg-blue-500 text-white shadow-lg"
                    : isToday
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-gray-100 hover:bg-gray-200"
                }
              `}
            >
              <span className="font-semibold text-sm">{day}</span>
              {eventCount > 0 && (
                <span className={`text-xs font-bold mt-1 ${
                  isSelected ? "bg-white text-blue-500" : "bg-blue-500 text-white"
                } px-2 py-0.5 rounded-full`}>
                  {eventCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
