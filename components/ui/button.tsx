import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  let baseStyles = "inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  let variantStyles = "bg-blue-600 hover:bg-blue-500 text-white";
  if (variant === "outline") variantStyles = "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-200";
  if (variant === "ghost") variantStyles = "bg-transparent hover:bg-slate-800 text-slate-300";
  if (variant === "destructive") variantStyles = "bg-rose-600 hover:bg-rose-500 text-white";

  let sizeStyles = "px-3 py-1.5 text-sm";
  if (size === "sm") sizeStyles = "px-2.5 py-1 text-xs";
  if (size === "lg") sizeStyles = "px-4 py-2 text-base";

  return (
    <button className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
