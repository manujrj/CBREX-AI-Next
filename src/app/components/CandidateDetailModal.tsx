import React from "react";
import { Candidate, ResumeAnalysis } from "@/types/matching";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

interface CandidateDetailModalProps {
  isOpen: boolean;
  candidate: ResumeAnalysis | null;
  onClose: () => void;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  isOpen,
  candidate,
  onClose,
}) => {
  const formDataState = useAppSelector((state) => state.result.formData);
  if (!isOpen || !candidate) return null;

  const buildInsight = (descriptionObj: Candidate): string => {
    let combined = "";
    for (const key of Object.keys(descriptionObj) as (keyof Candidate)[]) {
      combined += `<strong>${key.replace(/_/g, " ")}:</strong> ${
        descriptionObj[key]
      }<br>`;
    }
    return combined;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred and darkened background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-0" />
      <div className="bg-white dark:bg-[#1A1B24] rounded-lg max-w-6xl w-full max-h-[90vh] shadow-lg relative z-10 flex flex-col">
        <div className="sticky rounded-lg top-0 z-20 bg-white dark:bg-[#1A1B24] text-[#F1652E] p-6 flex gap-4 items-stretch">
          <Image
            src="/c-screen.svg"
            alt="C-Screen"
            height={48}
            width={60}
            className="h-12 top-[2px] relative"
          />
          <div className="text-5xl font-semibold">C-Screen Insights</div>
        </div>
        <div className="overflow-y-auto p-6 text-gray-800 dark:text-white">
          <div
            style={{
              backgroundImage: `url('/c-screen-bg.svg')`,
              backgroundRepeat: "repeat",
              backgroundSize: "50% 100%",
              backgroundPosition: "center",
              opacity: 1,
            }}
          >
            <div className="mb-2">
              <span className="font-semibold">Candidate Name:</span>{" "}
              {candidate.candidate_name}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Job Title:</span>{" "}
              {formDataState?.jobTitle || "N/A"}
            </div>
            <div className="mb-4">
              <div className="text-2xl mb-2 font-semibold">
                C-Screen Analysis
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: candidate["C-Screen Analysis"],
                }}
              ></div>
            </div>
            <div className="mb-4">
              <div className="text-2xl mb-2 font-semibold">
                Skill Check
                <span className="text-[#32A071]">
                  ({candidate.percentage_match}%)
                </span>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: buildInsight(candidate.detailed_description),
                }}
              ></div>
            </div>
          </div>
        </div>
        {/* Add more fields as needed */}
        <div className="mt-4 pr-6 pb-6 flex justify-end">
          <button
            className="px-4 py-2 border rounded border-[#F1652E] text-[#F1652E] hover:text-white font-medium hover:bg-[#E55A29]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailModal;
