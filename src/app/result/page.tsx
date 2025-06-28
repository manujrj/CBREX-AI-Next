"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { Candidate, ResumeAnalysis } from "@/types/matching";
import jsPDF from "jspdf";
import LimitExceedModal from "../components/LimitExceedModal";
import CandidateDetailModal from "../components/CandidateDetailModal";
import PrecessingModal from "../components/PrecessingModal";
import Image from "next/image";

const cScreenBgBase64 =
  "data:image/png;base64,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";

export default function ResultPage() {
  const userEmail = useAppSelector((state) => state.user.email);
  const initialData = useAppSelector((state) => state.result.data);
  const formDataState = useAppSelector((state) => state.result.formData);
  const [isUploading, setIsUploading] = useState(false);
  // Removed expandedRows state (no longer needed)
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [cfitResponse, setCfitResponse] = useState<string | null>(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [candidates, setCandidates] = useState<ResumeAnalysis[]>(
    initialData &&
      typeof initialData.best_resume?.AI_Response_Counter === "number" &&
      initialData.best_resume.AI_Response_Counter <= 10
      ? [initialData.best_resume]
      : []
  );
  const [selectedCandidate, setSelectedCandidate] =
    useState<ResumeAnalysis | null>(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const lastCandidate = candidates[candidates.length - 1];
  const lastCounter = lastCandidate?.AI_Response_Counter;
  const remainingCredits = 10 - lastCounter;

  useEffect(() => {
    if (
      initialData &&
      typeof initialData.best_resume?.AI_Response_Counter === "number" &&
      initialData.best_resume.AI_Response_Counter > 10
    ) {
      setIsLimitModalOpen(true);
    }
  }, [initialData]);

  useEffect(() => {
    if (
      candidates.length > 0 &&
      initialData &&
      typeof initialData.best_resume?.AI_Response_Counter === "number"
    ) {
      const counter = initialData.best_resume.AI_Response_Counter;
      if (counter <= 10) {
        setSelectedCandidate(candidates[candidates.length - 1]);
        setIsCandidateModalOpen(true);
      } else if (counter > 10) {
        setIsCandidateModalOpen(false);
        setIsLimitModalOpen(true);
      }
    }
  }, [candidates, initialData]);

  const handleAddResume = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";

    input.onchange = async (e: Event) => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement) || !target.files?.[0]) return;

      const file = target.files[0];

      if (!formDataState) {
        alert("Form data missing");
        return;
      }
      setIsProcessing(true);
      setIsUploading(true);
      const formData = new FormData();
      formData.append("jobDescription", "");
      formData.append("sourcingGuideline", formDataState.sourcingGuideline);
      formData.append("email", userEmail);
      formData.append("resume", file);

      try {
        const response = await fetch("/api/process", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const result = await response.json();
        setIsProcessing(false);
        if (result?.best_resume) {
          if (typeof result.best_resume.AI_Response_Counter === "number") {
            if (result.best_resume.AI_Response_Counter <= 10) {
              setCandidates((prev) => {
                const updated = [...prev, result.best_resume];
                setSelectedCandidate(result.best_resume);
                setIsCandidateModalOpen(true);
                return updated;
              });
            } else if (result.best_resume.AI_Response_Counter > 10) {
              setIsLimitModalOpen(true);
              setIsCandidateModalOpen(false);
              return;
            }
          }
        } else {
          setIsProcessing(false);
          console.warn("Unexpected response:", result);
        }
      } catch (err) {
        setIsProcessing(false);
        console.error("Error uploading:", err);
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  const buildInsight = (descriptionObj: Candidate): string => {
    let combined = "";
    for (const key of Object.keys(descriptionObj) as (keyof Candidate)[]) {
      combined += `<strong>${key.replace(/_/g, " ")}:</strong> ${
        descriptionObj[key]
      }<br>`;
    }
    return combined;
  };

  const getPreviewText = (htmlText: string, expanded: boolean): string => {
    if (expanded) return htmlText;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlText;
    const text = tempDiv.innerHTML
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "");
    const preview = text.trim().slice(0, 170);
    return text.length > 200 ? preview + "..." : preview;
  };

  // const handleCFitClick = async () => {
  //   if (!formDataState) {
  //     alert("Form data missing");
  //     return;
  //   }

  //   setIsModalOpen(true);
  //   setCfitResponse("Loading...");

  //   try {
  //     const response = await fetch("/api/cfit", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         sourcingGuideline: formDataState.sourcingGuideline,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     // Extract and store the HTML
  //     setCfitResponse(
  //       data.c_fit?.detailed_responses ?? "No C-Fit response returned."
  //     );
  //   } catch (error) {
  //     console.error("C-Fit error:", error);
  //     setCfitResponse("Error fetching C-Fit data");
  //   }
  // };

  const htmlToPlainTextInsight = (html: string): string => {
    const cleanedHtml = html.replace(/&#\d+;/g, "");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleanedHtml;

    const bullets: string[] = [];
    const sections = tempDiv.querySelectorAll("ul");

    sections.forEach((ul, sectionIndex) => {
      let sectionTitle = `Section ${sectionIndex + 1}`;
      const maybeTitle = ul.previousElementSibling;

      if (maybeTitle) {
        const strong = maybeTitle.querySelector("strong");
        sectionTitle = (
          strong?.textContent ||
          maybeTitle.textContent ||
          sectionTitle
        ).trim();
      }

      bullets.push(`${sectionTitle}:`);
      ul.querySelectorAll("li").forEach((li) => {
        const text = li.textContent?.trim().replace(/\s+/g, " ") || "";
        bullets.push(`• ${text}`);
      });

      bullets.push("");
    });
    return bullets.join("\n");
  };

  const downloadPDF = (resume: ResumeAnalysis) => {
    const { candidate_name, percentage_match, detailed_description } = resume;

    const name = candidate_name ?? "Unnamed";
    const score =
      percentage_match !== undefined ? `${percentage_match}%` : "N/A";

    // Add C-Screen Analysis (raw HTML, convert to plain text)
    const cScreenAnalysis = resume["C-Screen Analysis"] || "-";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cScreenAnalysis;
    const cScreenAnalysisText = tempDiv.textContent?.trim() || cScreenAnalysis;

    // Add Skill Check/Insight
    const htmlInsight = buildInsight(detailed_description ?? {});
    const plainInsight =
      htmlToPlainTextInsight(htmlInsight) || "No insight available.";

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // Helper to add background image with opacity 1 on every page
    const addBg = () => {
      doc.addImage(
        cScreenBgBase64,
        "PNG",
        0,
        0,
        doc.internal.pageSize.getWidth(),
        doc.internal.pageSize.getHeight(),
        undefined,
        "NONE" // No compression, full opacity
      );
    };

    // Add background to first page
    addBg();

    const margin = 40;
    const maxWidth = 515;
    let cursorY = 60;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Resume Insight Report", margin, cursorY);
    cursorY += 30;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Candidate Name: ${name}`, margin, cursorY);
    cursorY += 20;

    doc.text(`AI Score: ${score}`, margin, cursorY);
    cursorY += 30;

    // Add C-Screen Analysis section
    doc.setFont("helvetica", "bold");
    doc.text("C-Screen Analysis:", margin, cursorY);
    cursorY += 20;
    doc.setFont("helvetica", "normal");
    const cScreenLines = doc.splitTextToSize(cScreenAnalysisText, maxWidth);
    for (const line of cScreenLines) {
      if (cursorY >= 800) {
        doc.addPage();
        addBg();
        cursorY = 60;
      }
      doc.text(line, margin, cursorY);
      cursorY += 16;
    }
    cursorY += 10;

    // Add Insight section
    doc.setFont("helvetica", "bold");
    doc.text("Insight:", margin, cursorY);
    cursorY += 20;
    doc.setFont("helvetica", "normal");

    const sections = plainInsight.split("\n\n"); // Split by double newlines (each section)

    for (const section of sections) {
      const lines = section.split("\n");
      if (lines.length === 0) continue;

      const title = lines[0]; // e.g., "Skills Vs Experience Check::"
      const bullets = lines.slice(1);

      // Section title
      doc.setFont("helvetica", "bold");
      const wrappedTitle = doc.splitTextToSize(title, maxWidth);
      for (const line of wrappedTitle) {
        if (cursorY >= 800) {
          doc.addPage();
          addBg(); // Add background to new page
          cursorY = 60;
        }
        doc.text(line, margin, cursorY);
        cursorY += 16;
      }

      // Bullets
      doc.setFont("helvetica", "normal");
      for (const bullet of bullets) {
        const wrapped = doc.splitTextToSize(bullet, maxWidth);
        for (const line of wrapped) {
          if (cursorY >= 800) {
            doc.addPage();
            addBg(); // Add background to new page
            cursorY = 60;
          }
          doc.text(line, margin, cursorY);
          cursorY += 16;
        }
      }

      cursorY += 10; // Spacing between sections
    }

    doc.save(`${name.replace(/\s+/g, "_")}_insight.pdf`);
  };

  return (
    <>
      {/* <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="C-Fit"
        loading={!cfitResponse}
        size="large"
      >
        <div
          className="text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: cfitResponse || "" }}
        />
      </Modal> */}
      <PrecessingModal isOpen={isProcessing} />
      <LimitExceedModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
      />
      <CandidateDetailModal
        isOpen={isCandidateModalOpen}
        candidate={selectedCandidate}
        onClose={() => setIsCandidateModalOpen(false)}
      />

      <div className="space-y-6 min-h-screen p-6 bg-gray-50 dark:bg-[#1A1B24] transition-colors duration-300">
        <div className="mx-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <div className="rounded-lg p-3 mr-2">
              <Image
                src="/c-screen-pn.png"
                alt="C-Screen"
                width={60}
                height={60}
              />
            </div>
            <div className="flex flex-col gap-1 ">
              <div className="font-bold text-3xl color-orange">C-Screen</div>
              <div className="text-black dark:text-white text-base font-medium">
                AI-Powered Resume Screening
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-[#F1652E]">
              Screening Results
            </h1>
            <p className="text-lg text-gray-700 dark:text-white transition-colors duration-300">
              C-Screen has analyzed the resumes based on your job description
              and sourcing guidelines.
            </p>
          </div>

          {/* Job Title */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700 dark:text-white transition-colors duration-300">
                Job Title:
              </span>
              <span className="font-semibold text-[#F1652E]">
                {formDataState?.jobTitle}
              </span>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800 dark:text-white transition-colors duration-300">
              Resume Screening Results List
            </h2>
            <div className="gap-4 flex">
              {/* <button
                className="px-4 py-2 rounded-lg text-white font-medium bg-[#F1652E] hover:bg-[#E55A29] transition-colors duration-300"
                onClick={handleCFitClick}
              >
                C-Fit
              </button> */}
              <button
                className="px-4 py-2 rounded-lg text-white font-medium bg-[#F1652E] hover:bg-[#E55A29] transition-colors duration-300"
                onClick={handleAddResume}
                disabled={isUploading}
              >
                Screen Another Resume
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1B24] rounded-lg overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30 transition-colors duration-300">
              <div className="font-medium text-[#F1652E] col-span-1">
                Candidate Name
              </div>
              <div className="font-medium text-[#F1652E] col-span-1">
                C-Screen Score
              </div>
              <div className="font-medium text-[#F1652E] col-span-3">
                C-Screen Insights
              </div>
              <div className="font-medium text-[#F1652E] col-span-1">
                View/Download
              </div>
            </div>

            {/* Table Rows */}
            {candidates.map((resume, index) => {
              const candidateName = resume.candidate_name;
              const score = resume.percentage_match ?? "N/A";
              const cScreenAnalysis = resume["C-Screen Analysis"] || "-";
              const skillCheckInsight = buildInsight(
                resume.detailed_description
              );
              const insightRaw = `${cScreenAnalysis}<br><br>${skillCheckInsight}`;
              const previewText = getPreviewText(insightRaw, false);
              const isTruncated = previewText.endsWith("...");
              return (
                <div
                  key={index}
                  className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  <div className="text-gray-800 dark:text-white transition-colors duration-300 col-span-1">
                    {candidateName}
                  </div>
                  <div className="font-medium text-gray-800 dark:text-white transition-colors duration-300 col-span-1">
                    {score}%
                  </div>
                  <div className="text-gray-600 dark:text-white transition-colors duration-300 col-span-3">
                    <div dangerouslySetInnerHTML={{ __html: previewText }} />
                    {isTruncated && (
                      <button
                        className="text-blue-500 text-sm mt-2"
                        onClick={() => {
                          setSelectedCandidate(resume);
                          setIsCandidateModalOpen(true);
                          setIsLimitModalOpen(false);
                        }}
                      >
                        See More
                      </button>
                    )}
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => downloadPDF(resume)}
                      className="font-medium text-[#F1652E] hover:text-[#E55A29] hover:underline transition-colors duration-300"
                    >
                      View/PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Credits Footer */}
          <div className="mt-8 text-center">
            <p className="font-medium text-[#F1652E]">
              You now have {remainingCredits || 0} credits left.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
