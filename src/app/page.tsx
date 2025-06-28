"use client";
import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "./components/form/Input";
import Button from "./components/Button";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (
      isLoggedIn &&
      typeof window !== "undefined" &&
      window.location.pathname === "/"
    ) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  return (
    <main className="relative flex flex-col items-center justify-center px-4 min-h-[calc(100vh-5rem)] overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-home pointer-events-none" aria-hidden="true" />
      <h1 className="text-3xl font-bold text-[#F1652E] text-center mb-14 relative z-10">
        Start Your{" "}
        <span className="text-[#1A1B24] dark:text-white italic">AI Powered</span>{" "}
        Hiring Journey
      </h1>

      {/* Fixed: Light bg for light mode, dark bg for dark mode */}
      <div className="bg-white dark:bg-[#1A1B24] border border-[#F1652E] p-8 rounded-md max-w-md w-full shadow-lg relative z-10">
        <Formik
          initialValues={{ name: "", email: "" }}
          validationSchema={Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string()
              .email("Invalid email")
              .required("Email is required"),
          })}
          onSubmit={(values) => {
            dispatch(setUser(values));
            router.push("/dashboard");
          }}
        >
          {({ isValid, dirty }) => (
            <Form>
              <Input name="name" placeholder="Enter your Full Name" />
              <Input name="email" placeholder="Enter your Email Address" />

              <div className="flex justify-center mt-4">
                <Button type="submit" disabled={!(isValid && dirty)} className="w-[200px]">
                  Login
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm mt-4 text-gray-500 dark:text-gray-400">
          Don&apos;t have access? Contact{" "}
          <a
            href="mailto:sarvar@cbr.exchange"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            sarvar@cbr.exchange
          </a>
        </p>
      </div>

      <div className="flex gap-8 text-[#F1652E] text-base mt-20 flex-wrap justify-center font-bold relative z-10">
        <span className="drop-shadow-md dark:drop-shadow-lg">
          &bull; 6500+ Global hires
        </span>
        <span className="drop-shadow-md dark:drop-shadow-lg">
          &bull; Hired in 30+ countries
        </span>
        <span className="drop-shadow-md dark:drop-shadow-lg">
          &bull; Built on dataset of 250,000+ resumes
        </span>
        <span className="drop-shadow-md dark:drop-shadow-lg">
          &bull; Dataset Across 570+ job categories
        </span>
      </div>
    </main>
  );
}
