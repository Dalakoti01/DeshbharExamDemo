"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Share2 } from "lucide-react";
import { mockNews } from "@/data/mockData";
import NewsCard from "../shared/NewsCard";

const PRIMARY = "#6ec1d1";

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // UI-only filtering (mock)
  const categories = [...new Set(mockNews.map((item) => item.category))];

  const filteredNews = mockNews.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Latest Exam News & Updates",
        text: "Check out the latest exam news and updates.",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Latest News & Updates
        </h1>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md cursor-pointer"
          style={{ backgroundColor: PRIMARY }}
        >
          <Share2 size={16} />
          Share
        </button>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search news..."
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2"
            style={{ outlineColor: PRIMARY }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 cursor-pointer"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory("")}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            selectedCategory === ""
              ? "text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
          style={
            selectedCategory === ""
              ? { backgroundColor: PRIMARY }
              : {}
          }
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedCategory === category
                ? "text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
            style={
              selectedCategory === category
                ? { backgroundColor: PRIMARY }
                : {}
            }
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured News */}
      {filteredNews.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            Featured News
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredNews.slice(0, 2).map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </div>
      )}

      {/* All News */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">
          All News
        </h2>

        {filteredNews.length === 0 ? (
          <div className="text-center py-12 text-neutral-600">
            No news found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.slice(2).map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
