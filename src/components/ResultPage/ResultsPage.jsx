"use client";

import React from "react";
import Link from "next/link";
import {
  Download,
  Search,
  Calendar,
  ChevronRight,
  Share2,
} from "lucide-react";
import { mockResults } from "@/data/mockData";

const PRIMARY = "#6ec1d1";

export default function ResultsPage() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Exam Results",
        text: "Check out the latest exam results.",
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
          Exam Results
        </h1>

        <button
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white shadow-md transition hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: PRIMARY }}
        >
          <Share2 size={16} />
          Share
        </button>
      </div>

      {/* Info Banner */}
      <div
        className="p-4 rounded-lg mb-8 text-sm text-neutral-800"
        style={{ backgroundColor: `${PRIMARY}33` }}
      >
        Find the latest exam results of various government exams. Download the
        official PDFs directly.
      </div>

      {/* Search */}
      <div className="mb-8 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search results by exam name..."
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2"
            style={{ focusRingColor: PRIMARY }}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 cursor-pointer"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div
          className="px-6 py-4 text-lg font-semibold"
          style={{ backgroundColor: `${PRIMARY}33` }}
        >
          Latest Results
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                  Exam Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                  Result Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                  Result Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200">
  {mockResults.map((result) => (
    <tr key={result.id}>
      {/* Exam Name */}
      <td className="px-6 py-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition">
        {result.examName}
      </td>

      {/* Result Date */}
      <td className="px-6 py-4 text-sm text-neutral-600 hover:bg-neutral-50 transition">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          {result.resultDate}
        </div>
      </td>

      {/* Result Type */}
      <td className="px-6 py-4 hover:bg-neutral-50 transition">
        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: "#6ec1d1" }}
        >
          {result.resultType}
        </span>
      </td>

      {/* Action */}
      <td className="px-6 py-4 text-right hover:bg-neutral-50 transition">
        <a
          href={result.downloadLink}
          className="
            inline-flex items-center gap-1
            px-3 py-1.5
            rounded-md
            text-sm font-medium
            border
            transition-all
            cursor-pointer

            text-[#6ec1d1]
            border-[#6ec1d1]

            hover:bg-[#6ec1d1]
            hover:text-white
          "
        >
          <Download size={14} />
          Download
        </a>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>

        {mockResults.length === 0 && (
          <div className="p-8 text-center text-neutral-600">
            No results found.
          </div>
        )}
      </div>

      {/* Bottom Sections */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Links */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Check Other Sections
          </h3>

          <ul className="space-y-2">
            {[
              { href: "/admit-cards", label: "Admit Cards" },
              { href: "/answer-keys", label: "Answer Keys" },
              { href: "/syllabus", label: "Syllabus" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 transition"
                >
                  {item.label}
                  <ChevronRight size={16} className="text-neutral-400" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div
          className="rounded-xl p-6 text-neutral-900"
          style={{ backgroundColor: `${PRIMARY}33` }}
        >
          <h3 className="text-lg font-semibold mb-4">
            Need Personalized Results?
          </h3>
          <p className="text-sm mb-4">
            Sign up to receive result alerts relevant to your profile.
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md cursor-pointer"
            style={{ backgroundColor: PRIMARY }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
