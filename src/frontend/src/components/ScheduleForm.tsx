/**
 * 일정 등록 폼 컴포넌트
 */

import React from "react";
import { useForm } from "react-hook-form";
import { Schedule, CreateScheduleInput, ScheduleStatus, Priority } from "../types/index.js";

interface ScheduleFormProps {
  initialData?: Schedule;
  onSubmit: (data: CreateScheduleInput) => Promise<void>;
  isLoading?: boolean;
}

type FormData = CreateScheduleInput;

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      prompt: initialData.prompt,
      startDate: initialData.startDate,
      status: initialData.status as ScheduleStatus,
      priority: initialData.priority as Priority,
      tags: initialData.tags || [],
    } : {
      status: ScheduleStatus.PLAN,
      priority: Priority.MEDIUM,
      tags: [],
    },
  });

  const titleValue = watch("title");
  const descriptionValue = watch("description");
  const promptValue = watch("prompt");

  const onFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      if (!initialData) {
        reset();
      }
    } catch (error) {
      console.error("폼 제출 에러:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="card p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {initialData ? "일정 수정" : "새 일정 추가"}
      </h2>

      {/* 타이틀 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          개발 타이틀 *
        </label>
        <div className="relative">
          <input
            {...register("title", {
              required: "타이틀은 필수입니다",
              maxLength: { value: 100, message: "100자 이하여야 합니다" },
            })}
            className={`input ${errors.title ? "border-red-500" : ""}`}
            placeholder="예: 사용자 인증 시스템"
          />
          <span className="absolute right-3 top-3 text-xs text-gray-500">
            {titleValue?.length || 0}/100
          </span>
        </div>
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* 개발 내용 */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          개발 내용 *
        </label>
        <div className="relative">
          <textarea
            {...register("description", {
              required: "설명은 필수입니다",
              maxLength: { value: 1000, message: "1000자 이하여야 합니다" },
            })}
            className={`textarea ${errors.description ? "border-red-500" : ""}`}
            rows={3}
            placeholder="상세한 기능 설명을 입력하세요"
          />
          <span className="absolute right-3 bottom-3 text-xs text-gray-500">
            {descriptionValue?.length || 0}/1000
          </span>
        </div>
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* 프롬프트 */}
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
          AI 프롬프트 *
        </label>
        <div className="relative">
          <textarea
            {...register("prompt", {
              required: "프롬프트는 필수입니다",
              maxLength: { value: 5000, message: "5000자 이하여야 합니다" },
            })}
            className={`textarea ${errors.prompt ? "border-red-500" : ""}`}
            rows={4}
            placeholder="AI 모델에 제공할 상세한 프롬프트를 입력하세요"
          />
          <span className="absolute right-3 bottom-3 text-xs text-gray-500">
            {promptValue?.length || 0}/5000
          </span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(promptValue || "");
              alert("프롬프트가 복사되었습니다");
            }}
            className="btn-secondary px-2 py-1 text-xs mt-2"
          >
            📋 복사
          </button>
        </div>
        {errors.prompt && (
          <p className="text-red-600 text-sm mt-1">{errors.prompt.message}</p>
        )}
      </div>

      {/* 날짜 */}
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
          개발 시기 *
        </label>
        <input
          {...register("startDate", {
            required: "날짜는 필수입니다",
          })}
          type="date"
          className={`input ${errors.startDate ? "border-red-500" : ""}`}
        />
        {errors.startDate && (
          <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>
        )}
      </div>

      {/* 상태 */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          상태 *
        </label>
        <select {...register("status")} className="input">
          <option value={ScheduleStatus.PLAN}>계획</option>
          <option value={ScheduleStatus.IN_PROGRESS}>진행중</option>
          <option value={ScheduleStatus.COMPLETED}>완료</option>
        </select>
      </div>

      {/* 우선순위 */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
          우선순위
        </label>
        <select {...register("priority")} className="input">
          <option value={Priority.LOW}>낮음</option>
          <option value={Priority.MEDIUM}>중간</option>
          <option value={Priority.HIGH}>높음</option>
        </select>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex-1"
        >
          {isLoading ? "처리 중..." : initialData ? "수정" : "추가"}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="btn-secondary flex-1"
        >
          초기화
        </button>
      </div>
    </form>
  );
};

export default ScheduleForm;
