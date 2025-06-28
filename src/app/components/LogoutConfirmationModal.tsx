import React from "react";

type ModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onLogout: () => void;
};

const LogoutConfirmationModal = ({
  isOpen,
  onCancel,
  onLogout,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred and darkened background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-0" />
      <div className="bg-white dark:bg-[#1A1B24] text-center rounded-lg p-8 w-full max-w-2xl h-[400px] border border-[#F1652E] flex flex-col items-center justify-center transition-colors z-10 relative">
        <div>
          <h2 className="text-[#F1652E] text-2xl sm:text-3xl font-bold mb-6">
            Are you sure you want to Logout?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 text-sm sm:text-base transition-colors">
            Please note your results will not be saved for future use if you log
            out.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="border border-[#F1652E] text-[#F1652E] px-6 py-2 rounded-md hover:bg-[#f7e6df] dark:hover:bg-[#2a2b34] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onLogout}
              className="bg-[#F1652E] text-white px-6 py-2 rounded-md hover:bg-[#e15b25] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
