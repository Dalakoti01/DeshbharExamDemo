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
import NewsCard from "../shared/NewsCard";
import useGetAllJobs from "@/hooks/jobs/useGetAllJobs";
import useGetAllResults from "@/hooks/result/useGetAllResults";

const PRIMARY = "#6ec1d1";

export default function HomePage() {
  useGetAllJobs();
  useGetAllResults()
  const { allJobs,allResults } = useSelector((store) => store.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);

  // simple slicing (you can refine later)
  const latestJobs = allJobs?.slice(0, 5);
  const resultJobs = allJobs?.slice(5, 9);
  const admitCardJobs = allJobs?.slice(9, 13);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ================= HERO ================= */}
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3">
          Find Your Perfect{" "}
          <span style={{ color: PRIMARY }}>Government Job</span>
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Your one-stop platform for all government job notifications.
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

      {/* ================= CATEGORIES ================= */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {[
          { label: "Latest Jobs", icon: Calendar, path: "/jobs" },
          { label: "Results", icon: CheckSquare, path: "/results" },
          { label: "Admit Cards", icon: FileText, path: "/admit-cards" },
          { label: "Answer Keys", icon: Award, path: "/answer-keys" },
          { label: "Syllabus", icon: BookOpen, path: "/syllabus" },
        ].map(({ label, icon: Icon, path }) => (
          <Link
            key={label}
            href={path}
            className="bg-white border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md"
          >
            <Icon size={22} style={{ color: PRIMARY }} />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </section>

      {/* ================= FOUR COLUMNS ================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Column title="Latest Jobs">
          {latestJobs?.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
          <FooterLink href="/jobs" label="View All Jobs" />
        </Column>

        <Column title="Results">
          {resultJobs?.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
          <FooterLink href="/results" label="View All Results" />
        </Column>

        <Column title="Admit Cards">
          {admitCardJobs?.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
          <FooterLink href="/admit-cards" label="View All Admit Cards" />
        </Column>

        <Column title="News">
          <NewsCard />
          <NewsCard />
          <FooterLink href="/news" label="View All News" />
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
      className="flex items-center justify-center text-xs font-medium mt-2"
      style={{ color: PRIMARY }}
    >
      {label} <ArrowRight size={12} className="ml-1" />
    </Link>
  );
}
