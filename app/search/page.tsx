"use client";

import { useState, useEffect } from "react";
import PromptGallery from "@/components/PromptGallery";

interface Prompt {
  id: string;
  name: string;
  tags: string | null;
  content: string;
  created_at: string;
}

export default function SearchPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchPrompts();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Search Prompts</h2>

      <input
        type="text"
        placeholder="Search prompts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
      />

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : searchQuery === "" ? (
        <div className="text-center py-12 text-gray-500">
          Type to search for prompts...
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No prompts found matching "{searchQuery}"
        </div>
      ) : (
        <PromptGallery prompts={filteredPrompts} onRefresh={fetchPrompts} />
      )}
    </div>
  );
}
