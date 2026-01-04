"use client";

interface SimilarityBadgeProps {
  similarity: number; // 0-1 range
}

export function SimilarityBadge({ similarity }: SimilarityBadgeProps) {
  const percentage = Math.min(99, Math.round(similarity * 125));

  // Gradient based on match strength
  const gradientClass =
    percentage >= 80
      ? "bg-gradient-to-r from-emerald-500 to-cyan-500"
      : percentage >= 60
      ? "bg-gradient-to-r from-cyan-500 to-blue-500"
      : "bg-gradient-to-r from-blue-500 to-indigo-500";

  return (
    <span
      className={`${gradientClass} text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm flex-shrink-0`}
    >
      {percentage}% match
    </span>
  );
}

export default SimilarityBadge;
