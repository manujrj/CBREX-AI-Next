"use client";
import React, { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikProps,
  FieldProps,
  FormikErrors,
} from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { setFormData, setResult } from "@/lib/client/resultSlice";
import { useProcessMatchingMutation } from "@/lib/client/matchingApi";
import PrecessingModal from "../components/PrecessingModal";
import ResumeUploadError from "../components/ResumeUploadError";

interface FileUpload {
  name: string;
  size: number;
  type: string;
  file?: File;
}

interface FormValues {
  jobTitle: string;
  jobDescriptionText: string;
  jobDescriptionFile: FileUpload | null;
  sourcingGuidelines: string;
  resumeFile: FileUpload | null;
}

type DragOverType = "job" | "resume" | null;
type FileType = "job" | "resume";

const ResumeScreeningTool: React.FC = () => {
  const dispatch = useAppDispatch();
  const userEmail = useAppSelector((state) => state.user.email);
  const [processMatching, { isLoading, error }] = useProcessMatchingMutation();
  const router = useRouter();
  const [dragOver, setDragOver] = useState<DragOverType>(null);
  const [isResumeUploadModalOpen, setIsResumeUploadModalOpen] = useState(false);
  const jobFileRef = useRef<HTMLInputElement>(null);
  const resumeFileRef = useRef<HTMLInputElement>(null);
  const [formError, setFormError] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [isProcessing, setIsProcessing] = useState(false);

  const suggestedTags: string[] = [
    "Top 3 Mandatory Skills",
    "Minimum Relevant Experience",
    "Educational Qualifications",
    "Certifications",
    "Languages Known",
    "Job Stability",
  ];

  const initialValues: FormValues = {
    jobTitle: "",
    jobDescriptionText: "",
    jobDescriptionFile: null,
    sourcingGuidelines: "",
    resumeFile: null,
  };

  const validationSchema = Yup.object({
    jobTitle: Yup.string()
      .required("Job title is required")
      .min(2, "Job title must be at least 2 characters"),
    jobDescriptionText: Yup.string(),
    jobDescriptionFile: Yup.mixed<FileUpload>().nullable(),
    sourcingGuidelines: Yup.string()
      .required("Sourcing guidelines are required")
      .min(10, "Sourcing guidelines must be at least 10 characters"),
    resumeFile: Yup.mixed<FileUpload>()
      .nullable()
      .required("Resume file is required"),
  }).test(
    "job-description-required",
    "Either job description text or file is required",
    function (values) {
      const { jobDescriptionText, jobDescriptionFile } = values;
      const hasText = jobDescriptionText && jobDescriptionText.trim() !== "";
      const hasFile = jobDescriptionFile !== null;

      if (!hasText && !hasFile) {
        return this.createError({
          path: "jobDescriptionText",
          message: "Either job description text or file is required",
        });
      }
      return true;
    }
  );

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    type: FileType
  ): void => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: FileType,
    setFieldValue: (field: string, value: FileUpload | null | string) => void
  ): void => {
    e.preventDefault();
    setDragOver(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0], type, setFieldValue);
    }
  };

  const handleFileUpload = (
    file: File,
    type: FileType,
    setFieldValue: (field: string, value: FileUpload | null | string) => void
  ): void => {
    const allowedTypes: string[] = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const fileExtension = file.name.toLowerCase().split(".").pop();
    const allowedExtensions: string[] = ["pdf", "doc", "docx"];

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(fileExtension || "")
    ) {
      alert("Please select only PDF, DOC, or DOCX files.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      return;
    }

    const fileData: FileUpload = {
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    };

    if (type === "job") {
      setFieldValue("jobDescriptionFile", fileData);
      // Clear text when file is uploaded
      setFieldValue("jobDescriptionText", "");
    } else {
      setFieldValue("resumeFile", fileData);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: FileType,
    setFieldValue: (field: string, value: FileUpload | null | string) => void
  ): void => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, type, setFieldValue);
    }
  };

  const removeFile = (
    type: FileType,
    setFieldValue: (field: string, value: FileUpload | null | string) => void
  ): void => {
    if (type === "job") {
      setFieldValue("jobDescriptionFile", null);
      if (jobFileRef.current) jobFileRef.current.value = "";
    } else {
      setFieldValue("resumeFile", null);
      if (resumeFileRef.current) resumeFileRef.current.value = "";
    }
  };

  const toggleTag = (
    tag: string,
    currentValue: string,
    setFieldValue: (field: string, value: string) => void
  ): void => {
    const newGuidelines = currentValue ? `${currentValue}\n${tag}` : tag;
    setFieldValue("sourcingGuidelines", newGuidelines);
  };

  const handleUploadAreaClick = (type: FileType): void => {
    if (type === "job") {
      jobFileRef.current?.click();
    } else {
      resumeFileRef.current?.click();
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsProcessing(true);
    dispatch(
      setFormData({
        jobTitle: values.jobTitle,
        sourcingGuideline: values.sourcingGuidelines,
      })
    );

    // Create FormData for file uploads
    const formData = new FormData();
    formData.append("email", userEmail);
    formData.append("sourcingGuideline", values.sourcingGuidelines);
    if (values.jobDescriptionFile?.file) {
      formData.append("jobDescription", values.jobDescriptionFile.file);
    } else {
      formData.append("jobDescriptionText", values.jobDescriptionText || "");
    }
    if (values.resumeFile?.file) {
      formData.append("resume", values.resumeFile.file);
    }

    const response = await processMatching(formData).unwrap();
    setIsProcessing(false);

    if (
      typeof response?.best_resume === "string" &&
      (response.best_resume as string)?.toLowerCase().includes("error")
    ) {
      setIsResumeUploadModalOpen(true);
    } else {
      dispatch(setResult(response));
      router.push("/result");
    }
  };

  const validateAndSubmit = (
    values: FormValues,
    errors: Partial<FormikErrors<FormValues>>
  ): void => {
    setFormError({});
    const newErrors: Partial<Record<keyof FormValues, string>> = {};
    const isJobDescriptionValid =
      values.jobDescriptionText.trim() !== "" ||
      values.jobDescriptionFile !== null;

    if (!values.jobTitle) {
      newErrors.jobTitle = "Job title is required";
    }
    if (!isJobDescriptionValid) {
      newErrors.jobDescriptionText =
        "Either job description text or file is required";
    }
    if (!values.sourcingGuidelines) {
      newErrors.sourcingGuidelines = "Sourcing guidelines are required";
    }
    if (!values.resumeFile) {
      newErrors.resumeFile = "Resume file is required";
    }
    if (Object.keys(errors).length > 0) {
      Object.assign(newErrors, errors);
    }
    if (Object.keys(newErrors).length > 0) {
      setFormError(newErrors);
      return;
    }
    onSubmit(values);
  };

  const calculateProgress = (
    textLength: number,
    maxLength: number = 65000
  ): number => {
    return Math.min(textLength / maxLength, 1);
  };

  const getCircularProgressPath = (progress: number): number => {
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    return circumference * (1 - progress);
  };

  return (
    <>
      <PrecessingModal isOpen={isProcessing} />
      <ResumeUploadError
        isOpen={isResumeUploadModalOpen}
        onClose={() => {
          setIsResumeUploadModalOpen(false);
          router.push("/result");
        }}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-[#1A1B24] text-gray-900 dark:text-white p-8 transition-colors duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center mb-8">
            <div className="rounded-lg mr-2">
              <Image
                src="/c-screen-pn.png"
                alt="C-Screen"
                width={72}
                height={72}
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
            <h1 className="text-4xl md:text-3xl font-bold mb-4 text-[#F1652E]">
              Start New Resume Screening
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-1">
              Upload a Job Description, add your Sourcing Guidelines, and upload
              resumes to let C-Screen handle the rest.
            </p>
            <p className="text-[#F1652E] text-sm">(Max. 10 Resumes)</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({
              values,
              setFieldValue,
              errors,
              touched,
            }: FormikProps<FormValues>) => (
              <Form>
                <div className="space-y-6 border border-gray-200 dark:border-gray-700 p-6 rounded">
                  {/* Step 1: Upload Job Description */}
                  <div className="bg-white dark:bg-[#1A1B24] shadow-sm dark:shadow-none rounded-lg p-6 mb-6 transition-colors duration-300">
                    <h2 className="text-xl font-semibold mb-2">
                      Step 1: Upload Job Description
                    </h2>
                    <p className="text-gray-500 dark:text-gray-300 mb-4">
                      Upload a file or paste the job description to screen
                      resumes against.
                    </p>

                    {/* Job Title Field */}
                    <div className="mb-4">
                      <Field
                        name="jobTitle"
                        type="text"
                        placeholder="Senior Product Designer"
                        className={`w-full bg-white dark:bg-[#1A1B24] border ${
                          errors.jobTitle && touched.jobTitle
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:border-[#F1652E] transition-colors`}
                      />
                      <ErrorMessage
                        name="jobTitle"
                        component="div"
                        className="text-red-500 text-sm mt-2"
                      />
                      {formError.jobTitle && (
                        <div className="text-red-500 text-sm mt-2">
                          {formError.jobTitle}
                        </div>
                      )}
                    </div>

                    {/* File Upload Area */}
                    <div
                      className={`rounded-lg py-4 text-center transition-colors cursor-pointer ${
                        dragOver === "job"
                          ? "border-[#F1652E] bg-[#F1652E]/5 dark:bg-[#F1652E]/10"
                          : errors.jobDescriptionFile &&
                            touched.jobDescriptionFile
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                      onDragOver={(e) => handleDragOver(e, "job")}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, "job", setFieldValue)}
                      onClick={() => handleUploadAreaClick("job")}
                    >
                      {values.jobDescriptionFile ? (
                        <div
                          className="flex items-center justify-between rounded p-3"
                          style={{
                            backgroundColor: "#F1652E0D", // 5% opacity (0D in hex)
                            border: "1px solid #F1652E80", // 50% opacity
                          }}
                        >
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-[#F1652E] mr-3" />
                            <span className="text-sm">
                              {values.jobDescriptionFile.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              removeFile("job", setFieldValue);
                            }}
                            className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-[#F1652E] mx-auto mb-4" />
                          <p className="text-gray-900 dark:text-white mb-2">
                            <span className="text-blue-600 hover:text-blue-800 transition-colors">
                              Upload File
                            </span>{" "}
                            or Drag and Drop
                          </p>
                          <p className="text-gray-500 dark:text-gray-300 text-sm">
                            PDF, DOC, DOCX of up to 10 MB. Tables and images
                            will be ignored.
                          </p>
                        </>
                      )}
                    </div>

                    <input
                      ref={jobFileRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        handleFileSelect(e, "job", setFieldValue)
                      }
                      className="hidden"
                    />

                    {!values.jobDescriptionFile && (
                      <>
                        <div className="text-center mb-4">
                          <span className="text-gray-500 dark:text-gray-300">
                            Or
                          </span>
                        </div>

                        <Field name="jobDescriptionText">
                          {({ field }: FieldProps) => (
                            <textarea
                              {...field}
                              placeholder="Paste the job description here."
                              className={`w-full bg-white dark:bg-[#1A1B24] border ${
                                errors.jobDescriptionText &&
                                touched.jobDescriptionText
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-gray-600"
                              } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded px-3 py-3 h-40 resize-none focus:outline-none focus:border-[#F1652E] transition-colors`}
                              maxLength={65000}
                            />
                          )}
                        </Field>

                        {!errors.jobDescriptionText &&
                          formError.jobDescriptionText && (
                            <div className="text-red-500 text-sm">
                              {formError.jobDescriptionText}
                            </div>
                          )}

                        <div className="flex justify-end mt-2">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="relative w-3 h-3">
                              <svg
                                className="w-3 h-3 transform -rotate-90"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="#F1652E"
                                  strokeWidth="3"
                                  fill="none"
                                  opacity="0.2"
                                />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="#F1652E"
                                  strokeWidth="3"
                                  fill="none"
                                  strokeDasharray={`${2 * Math.PI * 10}`}
                                  strokeDashoffset={getCircularProgressPath(
                                    calculateProgress(
                                      values.jobDescriptionText.length
                                    )
                                  )}
                                  strokeLinecap="round"
                                />
                              </svg>
                            </div>
                            <span className="text-[#F1652E]">
                              {65000 - values.jobDescriptionText.length}{" "}
                              Characters Allowed
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Job Description Error Messages */}
                    <ErrorMessage
                      name="jobDescriptionText"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                    {/* Only show custom error if ErrorMessage is not already present */}
                  </div>

                  {/* Step 2: Add Sourcing Guidelines */}
                  <div className="bg-white dark:bg-[#1A1B24] shadow-sm dark:shadow-none rounded-lg p-6 mb-6 transition-colors duration-300">
                    <h2 className="text-xl font-semibold mb-2">
                      Step 2: Add Sourcing Guidelines
                    </h2>
                    <p className="text-gray-500 dark:text-gray-300 mb-4">
                      Define the key candidate traits or qualifications to
                      prioritize during screening.
                    </p>

                    <Field name="sourcingGuidelines">
                      {({ field }: FieldProps) => (
                        <textarea
                          {...field}
                          placeholder="Type your custom guideline(s)"
                          className={`w-full bg-white dark:bg-[#1A1B24] border ${
                            errors.sourcingGuidelines &&
                            touched.sourcingGuidelines
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded px-3 py-3 h-32 resize-none focus:outline-none focus:border-[#F1652E] transition-colors`}
                        />
                      )}
                    </Field>

                    {formError.sourcingGuidelines && (
                      <div className="text-red-500 text-sm">
                        {formError.sourcingGuidelines}
                      </div>
                    )}

                    <ErrorMessage
                      name="sourcingGuidelines"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300 mt-4 mb-3">
                        Suggested Guidelines
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() =>
                              toggleTag(
                                tag,
                                values.sourcingGuidelines,
                                setFieldValue
                              )
                            }
                            className="px-3 py-1 rounded-full text-sm border transition-colors border-[#F1652E] text-[#F1652E] hover:bg-[#F1652E] hover:text-white"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Upload Resume */}
                  <div className="bg-white dark:bg-[#1A1B24] shadow-sm dark:shadow-none rounded-lg p-6 mb-8 transition-colors duration-300">
                    <h2 className="text-xl font-semibold mb-2">
                      Step 3: Upload Resume
                    </h2>
                    <p className="text-gray-500 dark:text-gray-300 mb-4">
                      Upload the resume for screening. Supported formats: PDF,
                      DOCX.
                    </p>

                    {values.resumeFile ? (
                      <div
                        className="flex items-center justify-between rounded p-3 mb-3"
                        style={{
                          backgroundColor: "#F1652E0D",
                          border: "1px solid #F1652E80",
                        }}
                      >
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-[#F1652E] mr-3" />
                          <span className="text-sm">
                            {values.resumeFile.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("resume", setFieldValue)}
                          className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`rounded-lg p-4 text-center transition-colors cursor-pointer ${
                          dragOver === "resume"
                            ? "border-[#F1652E] bg-[#F1652E]/5 dark:bg-[#F1652E]/10"
                            : errors.resumeFile && touched.resumeFile
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                        onDragOver={(e) => handleDragOver(e, "resume")}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, "resume", setFieldValue)}
                        onClick={() => handleUploadAreaClick("resume")}
                      >
                        <Upload className="w-12 h-12 text-[#F1652E] mx-auto mb-4" />
                        <p className="text-gray-900 dark:text-white mb-2">
                          <span className="text-blue-600 hover:text-blue-800 transition-colors">
                            Upload File
                          </span>{" "}
                          or Drag and Drop
                        </p>
                        <p className="text-gray-500 dark:text-gray-300 text-sm">
                          PDF, DOC, DOCX of up to 10MB. Tables and images will
                          be ignored.
                        </p>
                      </div>
                    )}

                    <input
                      ref={resumeFileRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        handleFileSelect(e, "resume", setFieldValue)
                      }
                      className="hidden"
                    />

                    {/* <button
                      type="button"
                      onClick={() => resumeFileRef.current?.click()}
                      disabled={values.resumeFile !== null}
                      className={`px-4 py-2 rounded transition-colors ${
                        values.resumeFile
                          ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-[#F1652E] hover:bg-[#E55527] text-white cursor-pointer"
                      }`}
                    >
                      Upload Resume
                    </button> */}

                    <ErrorMessage
                      name="resumeFile"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                    {formError.resumeFile && (
                      <div className="text-red-500 text-sm">
                        {formError.resumeFile}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-7">
                  <button
                    type="button"
                    onClick={() => validateAndSubmit(values, errors)}
                    className="bg-[#F1652E] hover:bg-[#E55527] text-white px-6 py-2 rounded font-medium transition-colors"
                  >
                    {isLoading ? "Processing..." : "Screen Resume"}
                  </button>
                  {error && (
                    <div className="text-red-500 text-sm">
                      Error:{" "}
                      {JSON.stringify((error as FetchBaseQueryError).data)}
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default ResumeScreeningTool;
