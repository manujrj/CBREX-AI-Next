"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/client/hooks";
import Header from "../../components/Header";
import Modal from "../../components/Modal";
import { ArrowLeftIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Candidate, ResumeAnalysis } from "@/types/matching";
import jsPDF from "jspdf";

export default function ResultPage() {
  const router = useRouter();
  const initialData = useAppSelector((state) => state.result.data);
  const formDataState = useAppSelector((state) => state.result.formData);
  const [candidates, setCandidates] = useState<ResumeAnalysis[]>(
    initialData && initialData.best_resume.AI_Response_Counter <= 10
      ? [initialData.best_resume]
      : []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cfitResponse, setCfitResponse] = useState<string | null>(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  useEffect(() => {
    if (initialData && initialData.best_resume.AI_Response_Counter > 10) {
      setIsLimitModalOpen(true);
    }
  }, [initialData]);

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

        if (!response.ok) throw new Error("Upload failed");

        const result = await response.json();
        if (result?.best_resume) {
          if (result.best_resume.AI_Response_Counter > 10) {
            setIsLimitModalOpen(true);
            return;
          }
          setCandidates((prev) => [...prev, result.best_resume]);
        } else {
          console.warn("Unexpected response:", result);
        }
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
    const listItems = Array.from(tempDiv.querySelectorAll("li")).slice(0, 2);
    const limitedUl = document.createElement("ul");
    listItems.forEach((li) => limitedUl.appendChild(li.cloneNode(true)));
    return limitedUl.outerHTML;
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

    const htmlInsight = buildInsight(detailed_description ?? {});
    const plainInsight =
      htmlToPlainTextInsight(htmlInsight) || "No insight available.";

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
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
      <Modal
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
      </Modal>

      <Modal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        title="Request Limit Exceeded"
        size="small"
      >
        <p className="text-gray-700 dark:text-gray-300">
          The request limit for this user has been exceeded. <br />
          Please contact us at{" "}
          <a
            href="mailto:sarvar@cbr.exchange"
            className="text-blue-600 hover:underline"
          >
            sarvar@cbr.exchange
          </a>{" "}
          for further assistance.
        </p>
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
                <th className="w-1/12 p-3 text-left text-gray-700 dark:text-gray-300 align-top">
                  Download
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
                const liCount = (insightRaw.match(/<li>/g) || []).length;

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
                      {liCount > 2 && (
                        <button
                          className="text-blue-500 text-sm mt-2"
                          onClick={() => toggleExpand(index)}
                        >
                          {expandedRows[index] ? "See Less" : "See More"}
                        </button>
                      )}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 align-top">
                      <button
                        onClick={() => downloadPDF(resume)}
                        className="hover:text-blue-600"
                        title=""
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
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
