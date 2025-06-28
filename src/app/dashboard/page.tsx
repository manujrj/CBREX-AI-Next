"use client";
import React from "react";
import Button from "../components/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();

  const handleStartScreening = () => {
    router.push("/screening");
  };

  const handleComingSoon = () => {
    // Add your coming soon logic here
    console.log("Coming soon...");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] text-black dark:text-white bg-gray-50 dark:bg-[#1A1B24] p-6 overflow-hidden box-border transition-colors duration-300">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto h-full overflow-y-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h3 className="text-4xl md:text-3xl font-bold mb-4 text-[#F1652E]">
            Welcome to your CBREX AI Recruiter Suite
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            Choose a tool to begin simplifying your hiring process.
          </p>
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* C-Screen Card */}
          <div className="bg-white dark:bg-[#2A2B34] border-2 border-[#F1652E] rounded-lg py-6 px-10 hover:border-[#FF7A47] hover:shadow-lg hover:shadow-[#F1652E]/20 hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col h-full shadow-sm">
            <div className="flex items-center mb-4">
              <div className="rounded-lg p-3 mr-2">
                <Image
                  src="/c-screen-pn.png"
                  alt="C-Screen"
                  width={50}
                  height={50}
                />
              </div>
              <h3 className="text-xl font-semibold text-[#F1652E]">C-Screen</h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
              AI-Powered Resume Screening
            </p>

            <ul className="space-y-3 mb-8 text-sm text-gray-600 dark:text-gray-300 flex-grow font-medium">
              <li className="flex items-start">
                <span className="text-[#F1652E] mr-2">•</span>
                Upload & screen resumes instantly
              </li>
              <li className="flex items-start">
                <span className="text-[#F1652E] mr-2">•</span>
                Get C-Screen insights & Scores for each candidate
              </li>
              <li className="flex items-start">
                <span className="text-[#F1652E] mr-2">•</span>
                Save time with automated shortlist suggestions
              </li>
            </ul>

            <div className="mt-auto">
              <Button
                onClick={handleStartScreening}
                variant="primary"
                className="w-full"
              >
                Start Screening
              </Button>
            </div>
          </div>

          {/* C-Prompt Card */}
          <div className="bg-white dark:bg-[#2A2B34] border-2 border-[#F1652E] rounded-lg py-6 px-10 hover:border-[#FF7A47] hover:shadow-lg hover:shadow-[#F1652E]/20 hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col h-full shadow-sm">
            <div className="flex items-center mb-4">
              <div className="rounded-lg p-3 mr-2">
                <Image
                  src="/c-prompt.png"
                  alt="C-Prompt"
                  width={50}
                  height={50}
                />
              </div>
              <h3 className="text-xl font-semibold text-[#F1652E]">C-Prompt</h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
              AI Powered Market Analysis
            </p>

            <ul className="space-y-3 mb-8 text-sm text-gray-600 dark:text-gray-300 flex-grow font-medium">
              <li className="flex items-start">
                <span className="text-[#F1652E] mr-2">•</span>
                Access market intel using AI
              </li>
              <li className="flex items-start">
                <span className="text-[#F1652E] mr-2">•</span>
                Generate search strings & Boolean logic for recruiters
              </li>
            </ul>

            <div className="mt-auto">
              <Button
                onClick={handleComingSoon}
                variant="secondary"
                className="w-full"
                disabled={true}
              >
                Coming Soon
              </Button>
            </div>
          </div>

          {/* C-Fit Card */}
          <div className="bg-white dark:bg-[#2A2B34] border-2 border-[#F1652E] rounded-lg py-6 px-10 hover:border-[#FF7A47] hover:shadow-lg hover:shadow-[#F1652E]/20 hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col h-full shadow-sm">
            <div className="flex items-center mb-4">
              <div className="rounded-lg p-3 mr-2">
                <Image src="/c-fit.png" alt="C-Fit" width={50} height={50} />
              </div>
              <h3 className="text-xl font-semibold text-[#F1652E]">C-Fit</h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
              Candidate-Job Fit Predictor
            </p>

            <ul className="space-y-3 mb-8 text-sm text-gray-600 dark:text-gray-300 flex-grow font-medium">
              <li className="flex items-start">
                <span className="text-[#F1652E] mr-2">•</span>
                Generate skill based questions using AI
              </li>
              <li className="flex items-start">
                <span className="text-[#F1652E] mr-2">•</span>
                Assess candidate fitment
              </li>
              <li className="flex items-start">
                <span className="text-[#F1652E] mr-2">•</span>
                Improve quality-of-hire metrics
              </li>
            </ul>

            <div className="mt-auto">
              <Button
                onClick={handleComingSoon}
                variant="secondary"
                className="w-full"
                disabled={true}
              >
                Coming Soon
              </Button>
            </div>
          </div>
        </div>

        {/* More Tools Section */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-8">
          <div className="flex items-center mb-4">
            🚀
            <h2 className="text-xl font-semibold text-[#F1652E] dark:text-white ml-2">
              More AI tools launching soon
            </h2>
          </div>

          <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm font-medium">
            <li className="flex items-start">
              <span className="text-[#F1652E] dark:text-white mr-2">•</span>
              Candidate evaluation using C-Assess
            </li>
            <li className="flex items-start">
              <span className="text-[#F1652E] dark:text-white mr-2">•</span>
              Identify and engage relevant candidates efficiently using C-Source
            </li>
            <li className="flex items-start">
              <span className="text-[#F1652E] dark:text-white mr-2">•</span>
              All tools powered by CBREX&apos;s recruitment intelligence engine
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
