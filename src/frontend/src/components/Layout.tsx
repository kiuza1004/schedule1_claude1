/**
 * 메인 레이아웃 - 전체 앱 통합
 */

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import Calendar from "./Calendar.js";
import ScheduleForm from "./ScheduleForm.js";
import Search from "./Search.js";
import ScheduleList from "./ScheduleList.js";
import ConfirmModal from "./ConfirmModal.js";
import { scheduleApi } from "../services/api.js";
import { useScheduleStore } from "../store/scheduleStore.js";
import {
  CreateScheduleInput,
  Schedule,
  SearchFilters,
} from "../types/index.js";

type ModalState = { type: "delete" | "update"; data: Schedule } | null;

const Layout: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);

  const store = useScheduleStore();

  // 모든 일정 조회
  const { data: allSchedulesData, isLoading: isLoadingSchedules } = useQuery(
    "schedules",
    () => scheduleApi.getAll(1, 100),
    {
      onSuccess: (data) => {
        store.setSchedules(data.data);
      },
    }
  );

  // 일정 생성
  const createMutation = useMutation(scheduleApi.create, {
    onSuccess: (data) => {
      store.addSchedule(data.data);
      setShowForm(false);
      alert("일정이 생성되었습니다!");
    },
    onError: (error: any) => {
      alert(`오류: ${error.message}`);
    },
  });

  // 일정 수정
  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<CreateScheduleInput> }) =>
      scheduleApi.update(id, data),
    {
      onSuccess: (data) => {
        store.updateSchedule(data.data.id, data.data);
        setEditingSchedule(null);
        setModalState(null);
        alert("일정이 수정되었습니다!");
      },
      onError: (error: any) => {
        alert(`오류: ${error.message}`);
      },
    }
  );

  // 일정 삭제
  const deleteMutation = useMutation(scheduleApi.delete, {
    onSuccess: (data, id) => {
      store.deleteSchedule(id);
      setModalState(null);
      alert("일정이 삭제되었습니다!");
    },
    onError: (error: any) => {
      alert(`오류: ${error.message}`);
    },
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleFormSubmit = async (data: CreateScheduleInput) => {
    if (editingSchedule) {
      setModalState({ type: "update", data: editingSchedule });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    store.setFilters(filters);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const handleDelete = (schedule: Schedule) => {
    setModalState({ type: "delete", data: schedule });
  };

  const handleConfirmModal = async () => {
    if (!modalState) return;

    if (modalState.type === "delete") {
      await deleteMutation.mutateAsync(modalState.data.id);
    } else if (editingSchedule) {
      const updatedData: Partial<CreateScheduleInput> = {
        title: editingSchedule.title,
        description: editingSchedule.description,
        prompt: editingSchedule.prompt,
        startDate: editingSchedule.startDate,
        status: editingSchedule.status,
        priority: editingSchedule.priority,
      };
      await updateMutation.mutateAsync({
        id: editingSchedule.id,
        data: updatedData,
      });
    }
  };

  // 날짜별 항목 개수 계산
  const eventCounts = new Map<string, number>();
  store.schedules.forEach((schedule) => {
    const dateStr = new Date(schedule.startDate)
      .toISOString()
      .split("T")[0];
    eventCounts.set(dateStr, (eventCounts.get(dateStr) || 0) + 1);
  });

  // 선택된 날짜의 일정
  const selectedDateStr = selectedDate.toISOString().split("T")[0];
  const todaySchedules = store.schedules.filter((s) =>
    s.startDate.startsWith(selectedDateStr)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📅 Schedule Manager
              </h1>
              <p className="text-gray-600 mt-1">
                개발 일정 및 프롬프트 관리 시스템
              </p>
            </div>
            <button
              onClick={() => {
                setEditingSchedule(null);
                setShowForm(!showForm);
              }}
              className="btn-primary"
            >
              {showForm ? "✕ 닫기" : "+ 새 일정"}
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 달력 */}
          <div className="lg:col-span-1">
            <Calendar
              events={eventCounts}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          </div>

          {/* 오른쪽: 일정 관리 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 일정 추가 폼 */}
            {showForm && (
              <ScheduleForm
                initialData={editingSchedule || undefined}
                onSubmit={handleFormSubmit}
                isLoading={
                  createMutation.isLoading || updateMutation.isLoading
                }
              />
            )}

            {/* 검색 */}
            <Search
              onSearch={handleSearch}
              onFilter={handleSearch}
              isLoading={isLoadingSchedules}
            />

            {/* 선택된 날짜의 일정 */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                📋 {selectedDate.toLocaleDateString("ko-KR")}의 일정 (
                {todaySchedules.length}개)
              </h3>
              {todaySchedules.length > 0 ? (
                <ScheduleList
                  schedules={todaySchedules}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isLoading={
                    deleteMutation.isLoading || updateMutation.isLoading
                  }
                />
              ) : (
                <p className="text-gray-500 text-center py-8">
                  이 날짜에 일정이 없습니다
                </p>
              )}
            </div>

            {/* 전체 일정 목록 */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                📝 전체 일정 ({store.schedules.length}개)
              </h3>
              {store.schedules.length > 0 ? (
                <ScheduleList
                  schedules={store.filteredSchedules()}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isLoading={
                    deleteMutation.isLoading || updateMutation.isLoading
                  }
                />
              ) : (
                <p className="text-gray-500 text-center py-8">
                  아직 일정이 없습니다
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 모달 */}
      {modalState && (
        <ConfirmModal
          type={modalState.type}
          title={
            modalState.type === "delete"
              ? "일정 삭제"
              : "일정 수정"
          }
          message={
            modalState.type === "delete"
              ? "정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
              : "정말로 수정하시겠습니까?"
          }
          data={modalState.data}
          onConfirm={handleConfirmModal}
          onCancel={() => {
            setModalState(null);
            if (editingSchedule) {
              setEditingSchedule(null);
            }
          }}
          isLoading={
            deleteMutation.isLoading || updateMutation.isLoading
          }
        />
      )}
    </div>
  );
};

export default Layout;
