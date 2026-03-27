"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Mic,
  Calendar,
  FileText,
  CheckSquare,
  Award,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import JobCard from "../shared/JobCard";
import useGetAllJobs from "@/hooks/jobs/useGetAllJobs";
import useGetAllResults from "@/hooks/result/useGetAllResults";
import useGetAllAdmitCards from "@/hooks/admitCard/useGetAllAdmitCards";

const PRIMARY = "#6ec1d1";

export default function HomePage() {
  useGetAllJobs();
  useGetAllResults();
  useGetAllAdmitCards();

  const { allJobs, allResults, allAdmitCards } = useSelector(
    (store) => store.auth,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);

  // slicing
  const latestJobs = allJobs?.slice(0, 5);

  const latestAdmitCards = allAdmitCards?.slice(0, 5);

  const latestResults = allResults?.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ================= HERO ================= */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-3">
          Find Your Perfect{" "}
          <span className="text-[#ef4444]">Government Job</span>
        </h1>

        <p className="text-gray-600 max-w-2xl  mx-auto">
          Your one-stop platform for all government job notifications, exam
          results, admit cards, and more.
        </p>

        <form className="max-w-2xl mx-auto mt-6 relative">
          <div
            className="flex items-center border-2 rounded-xl overflow-hidden"
            style={{ borderColor: PRIMARY }}
          >
            <input
              className="flex-1 px-4 py-2.5 text-sm outline-none"
              placeholder="Ask anything. Eg- SSC GD age limit"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setIsVoiceSearch((p) => !p)}
              className="p-2.5 text-gray-500"
            >
              <Mic size={18} />
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-white"
              style={{ backgroundColor: PRIMARY }}
            >
              <Search size={18} />
            </button>
          </div>

          {isVoiceSearch && (
            <div className="absolute mt-2 inset-x-0 bg-white p-3 rounded-xl border text-xs">
              Listening... Speak now
            </div>
          )}
        </form>
      </section>

      {/* ================= HOT ENTRIES ================= */}
<section className="mb-10">
  <div className="bg-white rounded-xl border p-6 shadow-sm">

    {/* Header */}
    <div className="flex items-center justify-between mb-5">
      <h2 className="flex items-center">
        <span className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold mr-3 shadow-lg animate-pulse">
          🔥 HOT ENTRIES
        </span>
      </h2>

      <Link
        href="/jobs"
        className="text-sm font-medium flex items-center px-3 py-1 rounded-lg bg-[#6ec1d1]/10"
        style={{ color: PRIMARY }}
      >
        View All <ArrowRight size={14} className="ml-1" />
      </Link>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        // 2 Jobs
        ...latestJobs?.slice(0, 2)?.map((job) => ({
          id: job._id,
          title: job.title,
          subtitle: job.organization,
          href: `/job/${job._id}`,
          icon: <Calendar size={16} className="text-[#6ec1d1]" />,
          isNew: true, // you can later control from backend
        })),

        // 1 Result
        ...latestResults?.slice(0, 1)?.map((result) => ({
          id: result._id,
          title: result.examName,
          subtitle: "Result",
          href: `/result/${result._id}`,
          icon: <CheckSquare size={16} className="text-green-500" />,
          isNew: false,
        })),

        // 1 Admit Card
        ...latestAdmitCards?.slice(0, 1)?.map((card) => ({
          id: card._id,
          title: card.title,
          subtitle: "Admit Card",
          href: `/admit-card/${card._id}`,
          icon: <FileText size={16} className="text-blue-500" />,
          isNew: false,
        })),
      ]
        .slice(0, 4)
        .map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="bg-white border rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:scale-[1.05] block cursor-pointer"
          >
            {/* Icon */}
            <div className="flex justify-center mb-2">{item.icon}</div>

            {/* Title */}
            <p className="text-xs font-medium text-center line-clamp-2 mb-2">
              {item.title}
            </p>

            {/* Subtitle */}
            <p className="text-[11px] text-gray-500 text-center truncate mb-2">
              {item.subtitle}
            </p>

            {/* NEW Badge */}
            <div className="flex justify-center h-5">
              {item.isNew && (
                <span className="bg-yellow-400 text-black text-[10px] font-semibold px-2 py-[2px] rounded">
                  NEW
                </span>
              )}
            </div>
          </Link>
        ))}
    </div>
  </div>
</section>

      {/* ================= THREE COLUMNS ================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Latest Jobs */}
        <Column title="Latest Jobs">
          {latestJobs?.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
          <FooterLink href="/jobs" label="View All Jobs" />
        </Column>

        {/* RESULTS */}
        <Column title="Results">
          {latestResults?.map((result) => (
            <Link
              key={result._id}
              href={`/result/${result._id}`}
              className="block border rounded-lg p-2 text-sm hover:bg-gray-50 cursor-pointer"
            >
              <p className="font-medium">{result.examName}</p>

              {result.resultDate && (
                <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar size={12} />
                  {new Date(result.resultDate).toLocaleDateString()}
                </span>
              )}
            </Link>
          ))}

          <FooterLink href="/results" label="View All Results" />
        </Column>

        {/* ADMIT CARDS */}
        <Column title="Admit Cards">
          {latestAdmitCards?.map((card) => (
            <Link
              key={card._id}
              href={`/admit-card/${card._id}`}
              className="block border rounded-lg p-2 text-sm hover:bg-gray-50 cursor-pointer"
            >
              <p className="font-medium">{card.title}</p>

              {card?.importantDates?.admitCardsDate && (
                <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar size={12} />
                  {card.importantDates.admitCardsDate}
                </span>
              )}
            </Link>
          ))}

          <FooterLink href="/admit-cards" label="View All Admit Cards" />
        </Column>
      </section>
    </div>
  );
}

/* ---------- Helpers ---------- */

function Column({ title, children }) {
  return (
    <div className="bg-white border rounded-xl flex flex-col">
      <div
        className="text-white text-sm font-semibold text-center py-3 rounded-t-xl"
        style={{ backgroundColor: PRIMARY }}
      >
        {title}
      </div>
      <div className="p-3 space-y-3 flex-1">{children}</div>
    </div>
  );
}

function FooterLink({ href, label }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center text-xs font-medium mt-2 cursor-pointer"
      style={{ color: PRIMARY }}
    >
      {label} <ArrowRight size={12} className="ml-1" />
    </Link>
  );
}
