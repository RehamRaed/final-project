"use client";

import { Tables } from "@/types/database.types";
import { X, Map, BookOpen, Clock, Award } from "lucide-react";
import { useEffect } from "react";

interface Roadmap extends Tables<'roadmaps'> {
  course_count: number;
  is_current: boolean;
  description: string;
  icon: string | null;
}

interface RoadmapChangeConfirmationModalProps {
  roadmap: Roadmap;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  isFirstSelection: boolean; 
}

export default function RoadmapChangeConfirmationModal({
  roadmap,
  isOpen,
  onClose,
  onConfirm,
  isPending,
  isFirstSelection,
}: RoadmapChangeConfirmationModalProps) {

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isPending, onClose]);

  if (!isOpen) return null;

  const titleText = isFirstSelection ? "Choose Roadmap" : "Change Roadmap";
  const subtitleText = isFirstSelection
    ? "Confirm your learning path"
    : "Review the details before switching";

  const confirmButtonText = isFirstSelection
    ? `Choose ${roadmap.title}`
    : `Change to ${roadmap.title}`;

  const loadingText = isFirstSelection ? "Choosing..." : "Changing...";

  const noticeText = isFirstSelection
    ? "This roadmap will become your primary learning path. You can change it later from your profile."
    : "Changing your roadmap will update your learning path. Your progress in the current roadmap will be saved.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      <div className="bg-bg rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all">
        <div className="relative bg-primary text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            disabled={isPending}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Map className="w-8 h-8" />
            </div>
            <div>
              <h2 id="modal-title" className="text-2xl font-bold">
                {titleText}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {subtitleText}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-bg p-6 rounded-xl border-2 border-blue-200">
            <h3 className="text-xl font-bold text-text-primary mb-2">
              {roadmap.title}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {roadmap.description || "No description available"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={<BookOpen className="w-5 h-5 text-primary" />}
              label="Total Courses"
              value={roadmap.course_count}
            />
            <StatCard
              icon={<Clock className="w-5 h-5 text-green-600" />}
              label="Estimated Time"
              value={`${roadmap.course_count * 4}h`}
            />
            <StatCard
              icon={<Award className="w-5 h-5 text-purple-600" />}
              label="Total XP"
              value={roadmap.course_count * 100}
            />
          </div>

          <div className="bg-bg border-l-4 border-amber-400 p-4 rounded-lg">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-amber-600 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-secondary mb-1">
                  Important Notice
                </h4>
                <p className="text-sm text-secondary">
                  {noticeText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-bg px-6 py-4 rounded-b-2xl flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-6 py-3 rounded-xl font-semibold text-text-primary bg-bg border-2 border-gray-300 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-primary hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isPending ? loadingText : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-bg border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
        <div>
          <p className="text-xs text-text-secondary font-medium">{label}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
      </div>
    </div>
  );
}
