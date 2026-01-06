"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  BookOpen,
  Award,
  CheckSquare,
  ExternalLink,
  ChevronLeft,
  Share2,
} from "lucide-react";
import { mockJobs } from "@/data/mockData";

const PRIMARY = "#6ec1d1";

export default function JobDetailPage() {
  // UI-only: pick first job as mock detail
  const job = mockJobs[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <div className="mb-6">
        <Link
          href="/jobs"
          className="flex items-center text-sm text-neutral-600 hover:text-neutral-900 transition"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Job Listings
        </Link>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm mb-6">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                  {job.title}
                </h1>
                {job.isNew && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-md text-white"
                        style={{ backgroundColor: PRIMARY }}>
                    New
                  </span>
                )}
              </div>
              <p className="text-lg text-neutral-700">
                {job.organization}
              </p>
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md cursor-pointer"
              style={{ backgroundColor: PRIMARY }}
            >
              <Share2 size={16} />
              Share
            </button>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center">
              <MapPin size={20} className="mr-3" style={{ color: PRIMARY }} />
              <div>
                <p className="text-xs text-neutral-500">Location</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar size={20} className="mr-3" style={{ color: PRIMARY }} />
              <div>
                <p className="text-xs text-neutral-500">Posted Date</p>
                <p className="font-medium">{job.postedDate}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Clock size={20} className="mr-3" style={{ color: PRIMARY }} />
              <div>
                <p className="text-xs text-neutral-500">Last Date</p>
                <p className="font-medium">{job.lastDate}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="border-t border-neutral-200 pt-6">
            <h2 className="text-xl font-semibold mb-3">
              Job Description
            </h2>
            <p className="text-neutral-700 mb-6 whitespace-pre-line">
              {job.description}
            </p>

            <h2 className="text-xl font-semibold mb-3">
              Eligibility Criteria
            </h2>
            <p className="text-neutral-700 mb-6">
              {job.eligibility}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={job.applyLink}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-md w-full sm:w-auto"
                style={{ backgroundColor: PRIMARY }}
              >
                Apply Now
                <ExternalLink size={16} />
              </a>

              <button className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition w-full sm:w-auto">
                Save for Later
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: BookOpen,
            title: "Syllabus",
            desc: "Check the detailed syllabus for this exam.",
            href: "/syllabus",
          },
          {
            icon: Award,
            title: "Answer Keys",
            desc: "Access answer keys after the exam.",
            href: "/answer-keys",
          },
          {
            icon: CheckSquare,
            title: "Results",
            desc: "Check results once they are declared.",
            href: "/results",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center mb-3">
              <item.icon size={20} className="mr-2" style={{ color: PRIMARY }} />
              <h3 className="font-semibold">{item.title}</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              {item.desc}
            </p>
            <Link
              href={item.href}
              className="inline-flex items-center gap-1 text-sm font-medium"
              style={{ color: PRIMARY }}
            >
              View {item.title}
              <ExternalLink size={14} />
            </Link>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-10">
        <p className="text-neutral-600 mb-3">
          Looking for more opportunities?
        </p>
        <Link
          href="/jobs"
          className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-md"
          style={{ backgroundColor: PRIMARY }}
        >
          Explore More Jobs
        </Link>
      </div>
    </div>
  );
}
