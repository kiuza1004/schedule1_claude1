/**
 * 확인 모달 컴포넌트
 */

import React, { useState, useEffect } from "react";
import { Schedule } from "../types/index.js";

interface ConfirmModalProps {
  type: "delete" | "update";
  title: string;
  message: string;
  data?: Schedule | Partial<Schedule>;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  type,
  title,
  message,
  data,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const [canConfirm, setCanConfirm] = useState(type !== "delete");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 삭제 시 1초 후 확인 버튼 활성화
  useEffect(() => {
    if (type === "delete") {
      setCanConfirm(false);
      const timer = setTimeout(() => {
        setCanConfirm(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [type]);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* 헤더 */}
        <div className="mb-4">
          <h2
            id="modal-title"
            className={`text-xl font-bold ${
              type === "delete" ? "text-red-600" : "text-blue-600"
            }`}
          >
            {type === "delete" ? "⚠️ " : "✏️ "}
            {title}
          </h2>
        </div>

        {/* 메시지 */}
        <p className="text-gray-700 mb-4">{message}</p>

        {/* 데이터 표시 */}
        {data && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            {data.title && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">제목:</span> {data.title}
              </p>
            )}
            {type === "update" && (
              <div className="text-sm text-gray-600 mt-2 max-h-32 overflow-y-auto">
                <p className="font-medium mb-1">변경 사항:</p>
                {/* 변경 사항 표시 가능 */}
                <p>수정 내용이 표시됩니다</p>
              </div>
            )}
          </div>
        )}

        {/* 경고 메시지 (삭제 시) */}
        {type === "delete" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ 이 작업은 되돌릴 수 없습니다
            </p>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
            className="btn-secondary flex-1"
            aria-label="취소"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || isSubmitting || isLoading}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              type === "delete"
                ? "bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300"
                : "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
            }`}
            aria-label={type === "delete" ? "삭제" : "수정"}
          >
            {isSubmitting || isLoading ? (
              <>
                <span className="spinner inline-block mr-2"></span>
                처리 중...
              </>
            ) : type === "delete" ? (
              canConfirm ? "삭제" : "1초 후 활성화..."
            ) : (
              "수정"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
