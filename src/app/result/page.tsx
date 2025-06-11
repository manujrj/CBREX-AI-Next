"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/client/hooks";
import Header from "../../components/Header";
import Modal from "../../components/Modal";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ResultPage() {
  const router = useRouter();
  const initialData = useAppSelector((state) => state.result.data);
  const formDataState = useAppSelector((state) => state.result.formData);
  const [candidates, setCandidates] = useState<any[]>(
    initialData ? [initialData.best_resume] : []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {}
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cfitResponse, setCfitResponse] = useState<string | null>(null);

  const handleAddResume = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";

    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!formDataState) {
        alert("Form data missing");
        return;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append("jobDescription", "");
      formData.append("sourcingGuideline", formDataState.sourcingGuideline);
      formData.append("email", formDataState.email);
      formData.append("resume", file);

      try {
        const response = await fetch("/api/process", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        setCandidates((prev) => [...prev, result.best_resume]);
      } catch (err) {
        console.error("Error uploading:", err);
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  const toggleExpand = (index: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // combine detailed description into insight string
  const buildInsight = (descriptionObj: any): string => {
    let combined = "";
    for (const key in descriptionObj) {
      combined += `<strong>${key.replace(/_/g, " ")}:</strong> ${
        descriptionObj[key]
      }<br>`;
    }
    return combined;
  };

  const getPreviewText = (htmlText: string, expanded: boolean) => {
    const text = htmlText.replace(/<br\s*\/?>/gi, "\n");
    if (expanded) return text;
    const lines = text.split("\n");
    if (lines.length <= 3) return text;
    return lines.slice(0, 3).join("\n") + "...";
  };

  const handleCFitClick = async () => {
    if (!formDataState) {
      alert("Form data missing");
      return;
    }

    setIsModalOpen(true);
    setCfitResponse("Loading...");

    try {
      const response = await fetch("/api/cfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourcingGuideline: formDataState.sourcingGuideline,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract and store the HTML
      setCfitResponse(
        data.c_fit?.detailed_responses ?? "No C-Fit response returned."
      );
    } catch (error) {
      console.error("C-Fit error:", error);
      setCfitResponse("Error fetching C-Fit data");
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="C-Fit"
        loading={!cfitResponse}
      >
        <div
          className="text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: cfitResponse || "" }}
        />
      </Modal>

      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center transition-colors duration-300 p-10">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-6xl overflow-x-auto">
          {/* Button Row */}
          <div className="flex justify-between mb-6">
            <button
              onClick={() => router.push("/")}
              className="border border-orange-500 text-orange-500 px-4 py-2 rounded hover:bg-orange-50 dark:hover:bg-gray-700 transition font-medium flex items-center gap-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Add New Job
            </button>

            <div className="flex gap-4">
              <button
                onClick={handleCFitClick}
                className="border border-orange-500 text-orange-500 px-4 py-2 rounded hover:bg-orange-50 dark:hover:bg-gray-700 transition font-medium flex items-center gap-2"
              >
                C-Fit
              </button>

              <button
                onClick={handleAddResume}
                disabled={isUploading}
                className={`border ${
                  isUploading
                    ? "border-gray-400 text-gray-400"
                    : "border-blue-500 text-blue-500"
                } px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition font-medium`}
              >
                {isUploading ? "Uploading..." : "Add New Resume"}
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
            Matching Results
          </h1>

          <table className="min-w-full border-collapse table-fixed">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="w-1/6 p-3 text-left text-gray-700 dark:text-gray-300 align-top">
                  Candidate
                </th>
                <th className="w-1/6 p-3 text-left text-gray-700 dark:text-gray-300 align-top">
                  AI-Score
                </th>
                <th className="w-8/12 p-3 text-left text-gray-700 dark:text-gray-300 align-top">
                  Insight
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((resume, index) => {
                const candidateName = resume.candidate_name;
                const score = resume.percentage_match ?? "N/A";
                const insightRaw = buildInsight(resume.detailed_description);
                const previewText = getPreviewText(
                  insightRaw,
                  expandedRows[index]
                );

                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition align-top"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200 align-top">
                      {candidateName}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 align-top">
                      {score}%
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 align-top whitespace-pre-wrap">
                      <div dangerouslySetInnerHTML={{ __html: previewText }} />
                      {insightRaw.split("<br>").length > 2 && (
                        <button
                          className="text-blue-500 text-sm mt-2"
                          onClick={() => toggleExpand(index)}
                        >
                          {expandedRows[index] ? "See Less" : "See More"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
