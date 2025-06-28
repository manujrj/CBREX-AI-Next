import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LimitExceedModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred and darkened background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-0" />
      <div
        className="bg-white dark:bg-[#1A1B24] p-6 rounded-lg shadow-lg w-full max-w-2xl h-[400px] relative overflow-y-auto border z-10"
        style={{ borderColor: "#F1652E" }}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white font-semibold"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex flex-col items-center justify-center text-center h-full px-4">
          <h1 className="text-[#F1652E] text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
            You have reached the max <br /> limit of 10 resumes
          </h1>
          <p className="text-sm sm:text-base text-gray-700 dark:text-white">
            Contact CBREX for further assistance
            <br />
            <a
              href="mailto:sarvar@cbr.exchange"
              className="text-blue-500 hover:underline"
            >
              sarvar@cbr.exchange
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LimitExceedModal;
