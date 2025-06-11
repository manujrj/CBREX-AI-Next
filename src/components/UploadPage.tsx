"use client";

import { Formik, Form } from "formik";
import { useProcessMatchingMutation } from "@/lib/client/matchingApi";
import { setFormData, setResult } from "@/lib/client/resultSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/client/hooks";
import * as Yup from "yup";
import TextInput from "@/components/form/TextInput";
import TextareaInput from "@/components/form/TextareaInput";
import FileInput from "@/components/form/FileInput";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Header from "./Header";
import Image from "next/image";

export default function UploadPage() {
  const dispatch = useAppDispatch();
  const [processMatching, { isLoading, error }] = useProcessMatchingMutation();
  const router = useRouter();

  const validationSchema = Yup.object({
    jobDescription: Yup.mixed<File>().required("Required"),
    sourcingGuideline: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    resume: Yup.mixed<File>().required("Required"),
  });

  const handleSubmit = async (values: {
    jobDescription: File | null;
    sourcingGuideline: string;
    email: string;
    resume: File | null;
  }) => {
    if (!values.resume || !values.jobDescription) return;

    const formData = new FormData();
    formData.append("jobDescription", values.jobDescription);
    formData.append("sourcingGuideline", values.sourcingGuideline);
    formData.append("email", values.email);
    formData.append("resume", values.resume);

    const response = await processMatching(formData).unwrap();

    dispatch(setResult(response));
    dispatch(
      setFormData({
        sourcingGuideline: values.sourcingGuideline,
        email: values.email,
      })
    );
    router.push("/result");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        {/* Left Side (gray now) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 p-10">
          <div className="w-11/12 mb-6 bg-gray-900 rounded-sm shadow-lg">
            <Image
              src="/Homepagestats.png"
              alt="Illustration"
              width={1200}
              height={600}
              className="rounded-lg"
            />
          </div>

          {/* Recruitment headline */}
          <h2 className="text-3xl font-bold text-center mb-4">
            <span className="text-[#F26A21]">Recruitment.</span>{" "}
            <span className="text-gray-700 dark:text-gray-200">
              Rewired for What’s Next.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-center text-gray-500 dark:text-gray-300 text-lg leading-relaxed max-w-[90%]">
            Enter a world where technology meets intuition.
            <br />
            And solve your toughest recruitment challenges.
          </p>
        </div>

        {/* Right Side (scroll-isolated form area) */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 h-screen overflow-y-auto flex justify-center items-start pt-20">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg drop-shadow-md w-full max-w-lg">
            <Formik
              initialValues={{
                jobDescription: null,
                sourcingGuideline: "",
                email: "",
                resume: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit} className="space-y-5">
                  <FileInput label="Job Description" name="jobDescription" />
                  <TextareaInput label="Must Haves" name="sourcingGuideline" />
                  <TextInput label="Email" name="email" type="email" />
                  <FileInput label="Resume" name="resume" />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    {isLoading ? "Processing..." : "Submit"}
                  </button>

                  {error && (
                    <div className="text-red-500 text-sm">
                      Error:{" "}
                      {JSON.stringify((error as FetchBaseQueryError).data)}
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
