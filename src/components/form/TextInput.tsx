"use client";

import { useField } from "formik";

interface TextInputProps {
  label: string;
  name: string;
  type?: string;
}

export default function TextInput({
  label,
  name,
  type = "text",
}: TextInputProps) {
  const [field, meta] = useField(name);

  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        {...field}
        type={type}
        className={`w-full max-w-[97%] border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
          ${
            meta.touched && meta.error
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
      />
      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
}
