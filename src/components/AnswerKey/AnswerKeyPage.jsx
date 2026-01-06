"use client";

import React from "react";
import Link from "next/link";
import {
  Download,
  Search,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { mockAnswerKeys } from "@/data/mockData";

const PRIMARY = "#6ec1d1";

export default function AnswerKeyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-6">
        Answer Keys
      </h1>

      {/* Info Banner */}
      <div
        className="p-4 rounded-lg mb-8 text-sm text-neutral-800"
        style={{ backgroundColor: `${PRIMARY}33` }}
      >
        Download official answer keys to estimate your score and review your
        performance before results are announced.
      </div>

      {/* Search */}
      <div className="mb-8 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search answer keys by exam name..."
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
          Available Answer Keys
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                  Exam Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                  Exam Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                  Release Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200">
              {mockAnswerKeys.map((key) => (
                <tr key={key.id}>
                  {/* Exam Name */}
                  <td className="px-6 py-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition">
                    {key.examName}
                  </td>

                  {/* Exam Date */}
                  <td className="px-6 py-4 text-sm text-neutral-600 hover:bg-neutral-50 transition">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {key.examDate}
                    </div>
                  </td>

                  {/* Release Date */}
                  <td className="px-6 py-4 text-sm text-neutral-600 hover:bg-neutral-50 transition">
                    {key.releaseDate}
                  </td>

                  {/* Download */}
                  <td className="px-6 py-4 text-right hover:bg-neutral-50 transition">
                    <a
                      href={key.downloadLink}
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

        {mockAnswerKeys.length === 0 && (
          <div className="p-8 text-center text-neutral-600">
            No answer keys available at the moment.
          </div>
        )}
      </div>

      {/* Info Sections */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Calculation */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            How to Calculate Your Score
          </h3>
          <ol className="space-y-3 list-decimal pl-5 text-sm text-neutral-700">
            <li>Download the official answer key</li>
            <li>Compare your responses carefully</li>
            <li>Apply the marking scheme (+/−)</li>
            <li>Calculate your raw score</li>
            <li>Check for normalization updates if applicable</li>
          </ol>
        </div>

        {/* Objection */}
        <div
          className="rounded-xl p-6 text-neutral-900"
          style={{ backgroundColor: `${PRIMARY}33` }}
        >
          <h3 className="text-lg font-semibold mb-4">
            Objection Procedure
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-sm text-neutral-700">
            <li>Visit the official exam website</li>
            <li>Log in using your credentials</li>
            <li>Pay objection fee if required</li>
            <li>Submit evidence-based objections</li>
            <li>Track objection status online</li>
          </ul>
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
            { href: "/admit-cards", label: "Admit Cards" },
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
