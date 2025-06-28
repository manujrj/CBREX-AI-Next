import React from "react";
import Image from "next/image";

type ModalProps = {
  isOpen: boolean;
};

const PrecessingModal = ({ isOpen }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred and darkened background overlay */}
      <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-0 transition-colors" />
      <div
        className="bg-white dark:bg-[#1A1B24] text-gray-800 dark:text-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative overflow-y-auto border z-10 transition-colors"
        style={{ borderColor: "#F1652E" }}
      >
        <h1 className="text-[#F1652E] text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
          Screening in Progress...
        </h1>
        <div className="flex flex-col items-center justify-center text-center h-full py-10">
          <Image
            src="/gears-spinner.svg"
            alt="Processing"
            width={220}
            height={220}
          />
        </div>
      </div>
    </div>
  );
};

export default PrecessingModal;
