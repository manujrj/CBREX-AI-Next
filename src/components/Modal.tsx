"use client";

import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  loading?: boolean;
  size?: "small" | "medium" | "large";
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  loading = false,
  size = "medium",
}: ModalProps) {
  if (!isOpen) return null;

  const getSizeClass = (size?: "small" | "medium" | "large") => {
    switch (size) {
      case "small":
        return "max-w-md";
      case "medium":
        return "max-w-2xl";
      case "large":
        return "max-w-4xl";
      default:
        return "max-w-lg";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full relative ${getSizeClass(size)} overflow-y-auto`}>
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white font-semibold"
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
