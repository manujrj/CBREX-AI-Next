import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
}) => {
  const baseClasses =
    "font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#1A1B24] disabled:opacity-50 disabled:cursor-not-allowed";

  // Custom disabled style
  const disabledStyle = disabled
    ? {
        backgroundColor: "#999999",
      }
    : {};

  const variantClasses = {
    primary:
      "text-white bg-[#F1652E] hover:bg-[#E5511A] dark:bg-[#F1652E] dark:hover:bg-[#E5511A] focus:ring-[#F1652E]",
    secondary:
      "text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-gray-500",
    danger:
      "text-white bg-[#F1652E] hover:bg-[#E5511A] dark:bg-[#F1652E] dark:hover:bg-[#E5511A] focus:ring-[#F1652E]",
    success:
      "text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 focus:ring-green-500",
    warning:
      "text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 focus:ring-yellow-500",
    disabled:
      "bg-[#cccccc] text-black dark:bg-[#999999] dark:text-white cursor-not-allowed",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const combinedClasses = `${baseClasses} ${
    disabled ? variantClasses["disabled"] : variantClasses[variant]
  } ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      style={disabledStyle}
    >
      {children}
    </button>
  );
};

export default Button;
