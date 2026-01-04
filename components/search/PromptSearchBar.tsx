"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SearchModeToggle } from "./SearchModeToggle";

interface PromptSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  mode: "text" | "semantic";
  onModeChange: (mode: "text" | "semantic") => void;
  isSearching?: boolean;
}

export function PromptSearchBar({
  value,
  onChange,
  mode,
  onModeChange,
  isSearching,
}: PromptSearchBarProps) {
  const placeholders = {
    text: "Search prompts by name...",
    semantic: "Describe what you're looking for...",
  };

  return (
    <div className="w-full max-w-[768px]">
      <div
        className={`
          flex items-center gap-3 px-4 py-3
          bg-zinc-900/80 backdrop-blur-md
          border border-white/10 rounded-2xl
          transition-all duration-300
          focus-within:border-white/20
          focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)]
        `}
      >
        {/* Sparkle Icon */}
        <div className="flex-shrink-0">
          <svg
            className={`w-5 h-5 transition-colors ${
              isSearching ? "text-cyan-400 animate-pulse" : "text-cyan-500"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" />
          </svg>
        </div>

        {/* Input Field */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.input
              key={mode}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholders[mode]}
              className="w-full bg-transparent text-lg text-gray-100 placeholder-gray-500 focus:outline-none"
            />
          </AnimatePresence>
        </div>

        {/* Mode Toggle */}
        <div className="flex-shrink-0">
          <SearchModeToggle mode={mode} onChange={onModeChange} />
        </div>
      </div>
    </div>
  );
}

export default PromptSearchBar;
