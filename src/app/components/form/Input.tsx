"use client";
import { useField } from "formik";
import React from "react";
import Error from "../Error";

type Props = {
  label?: string;
  name: string;
  type?: string;
  placeholder: string;
};

const Input: React.FC<Props> = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        {...field}
        {...props}
        className={`w-full px-4 py-2 
          bg-white dark:bg-gray-800 
          border border-gray-300 dark:border-gray-600 
          text-gray-900 dark:text-white 
          placeholder-gray-500 dark:placeholder-gray-400
          rounded-md 
          focus:outline-none 
          focus:ring-2 
          focus:ring-[#F1652E] 
          focus:border-[#F1652E]
          transition-colors duration-200
          ${
            meta.touched && meta.error
              ? "border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500"
              : "hover:border-gray-400 dark:hover:border-gray-500"
          }`}
      />
      <Error message={meta.touched && meta.error ? meta.error : ""} />
    </div>
  );
};

export default Input;
