"use client";

import { motion } from "framer-motion";

interface SearchSkeletonGridProps {
  count?: number;
}

export function SearchSkeletonGrid({ count = 6 }: SearchSkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.08 }}
          className="border border-white/10 rounded-2xl p-6"
          style={{ backgroundColor: "#0d1117" }}
        >
          {/* Title skeleton */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 bg-zinc-800/60 rounded-lg w-3/4 animate-pulse" />
            <div className="h-5 bg-zinc-800/40 rounded-full w-16 animate-pulse" />
          </div>

          {/* Category badge skeleton */}
          <div className="mb-3">
            <div className="h-5 bg-zinc-800/40 rounded-full w-20 animate-pulse" />
          </div>

          {/* Content skeleton lines */}
          <div className="space-y-2">
            <div className="h-4 bg-zinc-800/40 rounded w-full animate-pulse" />
            <div className="h-4 bg-zinc-800/40 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-zinc-800/40 rounded w-4/6 animate-pulse" />
            <div className="h-4 bg-zinc-800/40 rounded w-3/4 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default SearchSkeletonGrid;
