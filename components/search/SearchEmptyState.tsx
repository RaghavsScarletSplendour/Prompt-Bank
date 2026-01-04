"use client";

import { motion } from "framer-motion";

interface SearchEmptyStateProps {
  mode: "text" | "semantic";
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  "Creative Writing",
  "Code Review",
  "Data Analysis",
  "Email Templates",
];

export function SearchEmptyState({ mode, onSuggestionClick }: SearchEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16"
    >
      {/* Search Illustration */}
      <svg
        className="w-24 h-24 text-gray-600 mb-6"
        viewBox="0 0 100 100"
        fill="none"
      >
        {/* Magnifying glass */}
        <circle
          cx="40"
          cy="40"
          r="25"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <line
          x1="58"
          y1="58"
          x2="78"
          y2="78"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Sparkle accents */}
        <path
          d="M75 20L77 25L82 27L77 29L75 34L73 29L68 27L73 25L75 20Z"
          fill="currentColor"
          opacity="0.6"
        />
        <path
          d="M20 65L21.5 68.5L25 70L21.5 71.5L20 75L18.5 71.5L15 70L18.5 68.5L20 65Z"
          fill="currentColor"
          opacity="0.4"
        />
        <path
          d="M85 55L86 57.5L88.5 58.5L86 59.5L85 62L84 59.5L81.5 58.5L84 57.5L85 55Z"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>

      {/* Text */}
      <h3 className="text-lg font-medium text-gray-300 mb-2">
        {mode === "semantic"
          ? "Discover prompts with AI-powered search"
          : "Search your prompt library"}
      </h3>
      <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
        {mode === "semantic"
          ? "Describe what you need in natural language and we'll find the best matches"
          : "Type to search for prompts by name"}
      </p>

      {/* Suggestion Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-xs text-gray-500 mr-1">Try:</span>
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-3 py-1.5 bg-zinc-800/60 hover:bg-zinc-700/60 border border-white/10 hover:border-white/20 rounded-full text-sm text-gray-400 hover:text-gray-200 transition-all"
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default SearchEmptyState;
