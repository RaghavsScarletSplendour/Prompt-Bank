"use client";

import { useState, useEffect, useCallback } from "react";
import PromptGallery from "@/components/PromptGallery";

interface Prompt {
  id: string;
  name: string;
  tags: string | null;
  content: string;
  created_at: string;
  similarity?: number;
}

export default function SearchPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<"text" | "semantic">("text");
  const [searchResults, setSearchResults] = useState<Prompt[]>([]);

  // Text search: filter locally
  const filteredPrompts = prompts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/prompts");
      const data = await res.json();
      setPrompts(data.prompts || []);
    } finally {
      setLoading(false);
    }
  };

  // Semantic search: call API
  const semanticSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/prompts/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setSearchResults(data.prompts || []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce semantic search
  useEffect(() => {
    if (searchMode !== "semantic") return;

    const timer = setTimeout(() => {
      semanticSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchMode, semanticSearch]);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const displayPrompts =
    searchMode === "semantic" ? searchResults : filteredPrompts;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Search Prompts
      </h2>

      {/* Search Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSearchMode("text")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            searchMode === "text"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Text Search
        </button>
        <button
          onClick={() => setSearchMode("semantic")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            searchMode === "semantic"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Semantic Search
        </button>
      </div>

      <input
        type="text"
        placeholder={
          searchMode === "semantic"
            ? "Describe what you're looking for..."
            : "Search prompts by name..."
        }
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
      />

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          {searchMode === "semantic" ? "Searching..." : "Loading..."}
        </div>
      ) : searchQuery === "" ? (
        <div className="text-center py-12 text-gray-500">
          {searchMode === "semantic"
            ? "Describe your task in natural language to find the best matching prompts..."
            : "Type to search for prompts by name..."}
        </div>
      ) : displayPrompts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No prompts found matching "{searchQuery}"
        </div>
      ) : (
        <PromptGallery
          prompts={displayPrompts}
          onRefresh={fetchPrompts}
          showSimilarity={searchMode === "semantic"}
        />
      )}
    </div>
  );
}
