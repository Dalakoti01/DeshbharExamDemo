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
import { mockAdmitCards } from "@/data/mockData";

const PRIMARY = "#6ec1d1";

export default function AdmitCardPage() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Admit Cards",
        text: "Download admit cards for government exams.",
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
          Admit Cards
        </h1>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white shadow-md transition hover:opacity-90 cursor-pointer"
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
        Download admit cards for upcoming examinations. Check exam dates carefully
        and carry your admit card to the exam center.
      </div>

      {/* Search */}
      <div className="mb-8 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search admit cards by exam name..."
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2"
            style={{ outlineColor: PRIMARY }}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 cursor-pointer"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div
          className="px-6 py-4 text-lg font-semibold"
          style={{ backgroundColor: `${PRIMARY}33` }}
        >
          Available Admit Cards
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                  Exam Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                  Exam Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200">
              {mockAdmitCards.map((card) => (
                <tr key={card.id}>
                  {/* Exam Name */}
                  <td className="px-6 py-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition">
                    {card.examName}
                  </td>

                  {/* Exam Date */}
                  <td className="px-6 py-4 text-sm text-neutral-600 hover:bg-neutral-50 transition">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {card.examDate}
                    </div>
                  </td>

                  {/* Download */}
                  <td className="px-6 py-4 text-right hover:bg-neutral-50 transition">
                    <a
                      href={card.downloadLink}
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

        {mockAdmitCards.length === 0 && (
          <div className="p-8 text-center text-neutral-600">
            No admit cards available at the moment.
          </div>
        )}
      </div>

      {/* Bottom Sections */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instructions */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Important Instructions
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-sm text-neutral-700">
            <li>Carry a valid photo ID along with the admit card</li>
            <li>Reach the examination center at least 30 minutes early</li>
            <li>Verify all details printed on the admit card</li>
            <li>Follow all examination guidelines strictly</li>
          </ul>
        </div>

        {/* CTA */}
        <div
          className="rounded-xl p-6 text-neutral-900"
          style={{ backgroundColor: `${PRIMARY}33` }}
        >
          <h3 className="text-lg font-semibold mb-4">
            Need Personalized Updates?
          </h3>
          <p className="text-sm mb-4">
            Sign up to receive notifications when admit cards matching your
            profile are released.
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

      {/* Other Sections */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">
          Check Other Sections
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/results", label: "Exam Results" },
            { href: "/answer-keys", label: "Answer Keys" },
            { href: "/syllabus", label: "Syllabus" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-[#6ec1d1]"
            >
              {item.label}
              <ChevronRight size={16} className="ml-auto text-neutral-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
