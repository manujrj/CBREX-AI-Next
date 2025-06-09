"use client";

import { useField, useFormikContext } from "formik";

interface FileInputProps {
  label: string;
  name: string;
}

export default function FileInput({ label, name }: FileInputProps) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFieldValue(name, file);
  };

  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
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
