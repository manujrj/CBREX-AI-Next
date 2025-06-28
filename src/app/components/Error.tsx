import React from "react";

type ErrorProps = {
  message?: string;
};

const Error: React.FC<ErrorProps> = ({ message }) => {
  return (
    <div className="min-h-[20px] text-red-500 text-sm mt-1">
      {message || ""}
    </div>
  );
};

export default Error;
