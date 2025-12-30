import { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  padding = "md",
  interactive = false,
  className = "",
  ...props
}: CardProps) {
  const baseClasses = "bg-gray-800 border border-white/5 rounded-2xl";
  const shadowStyle = { boxShadow: "var(--shadow-card)" };
  const interactiveClasses = interactive
    ? "cursor-pointer hover:border-white/10 transition-colors"
    : "";

  return (
    <div
      className={`${baseClasses} ${paddingClasses[padding]} ${interactiveClasses} ${className}`}
      style={shadowStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
