"use client";

import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  loading?: boolean;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  loading = false,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-5xl w-full relative max-h-[80vh] overflow-y-auto">
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        {title && (
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
        )}

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-300">
            Loading...
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
