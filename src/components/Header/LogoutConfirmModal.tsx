'use client';

import React from 'react';

interface Props {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({ open, loading, onClose, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-bg rounded-lg shadow-lg max-w-sm w-full p-6 animate-fadeIn">
        <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
        <p className="mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-600"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 hover:cursor-pointer rounded bg-red-600 text-white font-bold hover:bg-red-700 flex items-center justify-center"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && (
              <svg
                className="animate-spin mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}