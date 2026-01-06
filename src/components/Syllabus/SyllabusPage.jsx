"use client";

import React from "react";
import Link from "next/link";
import {
  Download,
  Search,
  BookOpen,
  List,
  ChevronRight,
} from "lucide-react";
import { mockSyllabus } from "@/data/mockData";

const PRIMARY = "#6ec1d1";

export default function SyllabusPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-6">
        Exam Syllabus
      </h1>

      {/* Info Banner */}
      <div
        className="p-4 rounded-lg mb-8 text-sm text-neutral-800"
        style={{ backgroundColor: `${PRIMARY}33` }}
      >
        Access detailed syllabus for various competitive exams. Understanding
        the syllabus is the first step toward effective preparation.
      </div>

      {/* Search */}
      <div className="mb-8 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search syllabus by exam name..."
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

      {/* Syllabus Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm mb-10">
        <div
          className="px-6 py-4 text-lg font-semibold"
          style={{ backgroundColor: `${PRIMARY}33` }}
        >
          Available Syllabus
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                  Exam Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                  Subjects
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200">
              {mockSyllabus.map((syllabus) => (
                <tr key={syllabus.id}>
                  {/* Exam Name */}
                  <td className="px-6 py-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition">
                    {syllabus.examName}
                  </td>

                  {/* Subjects */}
                  <td className="px-6 py-4 hover:bg-neutral-50 transition">
                    <div className="flex flex-wrap gap-2">
                      {syllabus.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="rounded-md px-2 py-1 text-xs text-neutral-700"
                          style={{ backgroundColor: `${PRIMARY}22` }}
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Download */}
                  <td className="px-6 py-4 text-right hover:bg-neutral-50 transition">
                    <a
                      href={syllabus.downloadLink}
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

        {mockSyllabus.length === 0 && (
          <div className="p-8 text-center text-neutral-600">
            No syllabus available at the moment.
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Study Material */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <BookOpen size={22} style={{ color: PRIMARY }} className="mr-3" />
            <h3 className="text-lg font-semibold">Study Material</h3>
          </div>
          <p className="text-sm text-neutral-700 mb-4">
            Access recommended books, guides, and study resources for effective
            exam preparation.
          </p>
          <Link
            href="#"
            className="inline-flex items-center text-sm font-medium"
            style={{ color: PRIMARY }}
          >
            Explore Resources <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        {/* Previous Year Papers */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <List size={22} style={{ color: PRIMARY }} className="mr-3" />
            <h3 className="text-lg font-semibold">Previous Year Papers</h3>
          </div>
          <p className="text-sm text-neutral-700 mb-4">
            Practice with previous year papers to understand exam patterns and
            difficulty levels.
          </p>
          <Link
            href="#"
            className="inline-flex items-center text-sm font-medium"
            style={{ color: PRIMARY }}
          >
            View Papers <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        {/* Preparation Tips */}
        <div
          className="rounded-xl p-6 text-neutral-900"
          style={{ backgroundColor: `${PRIMARY}33` }}
        >
          <h3 className="text-lg font-semibold mb-4">
            Preparation Tips
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-sm text-neutral-700">
            <li>Understand the complete syllabus first</li>
            <li>Create a structured study plan</li>
            <li>Practice previous year papers regularly</li>
            <li>Focus more on weak areas</li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">
          Can't find what you're looking for?
        </h3>
        <p className="text-sm text-neutral-700 mb-6 max-w-2xl mx-auto">
          Sign up to receive personalized recommendations and notifications for
          new syllabus updates.
        </p>

        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-md"
          style={{ backgroundColor: PRIMARY }}
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
