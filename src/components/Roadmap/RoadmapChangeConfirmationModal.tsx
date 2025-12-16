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
}

export default function RoadmapChangeConfirmationModal({
    roadmap,
    isOpen,
    onClose,
    onConfirm,
    isPending
}: RoadmapChangeConfirmationModalProps) {

    // Close modal on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isPending) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isPending, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => {
                // Close on backdrop click
                if (e.target === e.currentTarget && !isPending) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl">
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
                                Change Roadmap
                            </h2>
                            <p className="text-blue-100 text-sm mt-1">
                                Review the details before switching
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Roadmap Title */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {roadmap.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            {roadmap.description || "No description available"}
                        </p>
                    </div>

                    {/* Roadmap Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Total Courses</p>
                                    <p className="text-2xl font-bold text-gray-800">{roadmap.course_count}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Estimated Time</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {roadmap.course_count * 4}h
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Award className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Total XP</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {roadmap.course_count * 100}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Warning Message */}
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-amber-800 mb-1">
                                    Important Notice
                                </h4>
                                <p className="text-sm text-amber-700">
                                    Changing your roadmap will update your learning path. Your progress in the current roadmap will be saved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        aria-label="Cancel and close modal"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                        aria-label={isPending ? "Processing..." : `Confirm change to ${roadmap.title}`}
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Changing...
                            </span>
                        ) : (
                            `Change to ${roadmap.title}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
