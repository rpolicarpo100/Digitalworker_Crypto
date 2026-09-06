import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "outline";
}

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  let variantStyles = "bg-slate-800 text-slate-200 border-slate-700";
  if (variant === "success") variantStyles = "bg-emerald-950/80 text-emerald-400 border-emerald-800/80";
  if (variant === "warning") variantStyles = "bg-amber-950/80 text-amber-400 border-amber-800/80";
  if (variant === "destructive") variantStyles = "bg-rose-950/80 text-rose-400 border-rose-800/80";
  if (variant === "outline") variantStyles = "bg-transparent text-slate-300 border-slate-700";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
