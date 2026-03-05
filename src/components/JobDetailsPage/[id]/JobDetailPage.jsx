"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import useGetSingleJob from "@/hooks/jobs/useGetSingleJob";
import { mockJobs } from "@/data/mockData";
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

const PRIMARY = "#6ec1d1";

/* ---------------- NORMALIZER ---------------- */

const normalizeJobForUI = (job) => {
  if (!job) return null;

  const locationText =
    typeof job.location === "string"
      ? job.location
      : [job.location?.city, job.location?.state]
          .filter(Boolean)
          .join(", ");

  return {
    ...job,
    locationText,
    applyDeadline:
      job.lastDate ||
      job.importantDates?.applicationDeadline ||
      "—",
    examDate: job.importantDates?.examDate || "—",
    applyLink:
      job.applyLink || job.importantLinks?.applyOnline || "#",
  };
};

/* ---------------- PAGE ---------------- */

export default function JobDetailPage() {
  const { id } = useParams();

  useGetSingleJob(id);

  const { singleJob, loadingSingleJob } = useSelector(
    (store) => store.auth
  );

  // 🔁 fallback only during dev
  const fallbackMockJob = mockJobs.find((j) => j.id === id);
  const job = normalizeJobForUI(singleJob || fallbackMockJob);

  /* ---------- loading ---------- */
  if (loadingSingleJob) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto"
          style={{ borderColor: PRIMARY }}
        />
        <p className="mt-3 text-neutral-600">
          Loading job details...
        </p>
      </div>
    );
  }

  /* ---------- not found ---------- */
  if (!job) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-semibold mb-3">
          Job Not Found
        </h2>
        <Link
          href="/jobs"
          className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: PRIMARY }}
        >
          Browse Jobs
        </Link>
      </div>
    );
  }

  /* ---------- share ---------- */
  const handleShare = () => {
    navigator.share
      ? navigator.share({
          title: job.title,
          url: window.location.href,
        })
      : navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/jobs"
        className="flex items-center text-sm mb-6 text-neutral-600"
      >
        <ChevronLeft size={16} className="mr-1" />
        Back to Job Listings
      </Link>

      {/* Card */}
      <div className="rounded-xl border bg-white shadow-sm mb-6">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {job.title}
              </h1>
              <p className="text-neutral-600 mt-1">
                {job.locationText || "—"}
              </p>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg cursor-pointer"
              style={{ backgroundColor: PRIMARY }}
            >
              <Share2 size={16} />
              Share
            </button>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Meta icon={MapPin} label="Location" value={job.locationText} />
            <Meta icon={Calendar} label="Exam Date" value={job.examDate} />
            <Meta icon={Clock} label="Apply Till" value={job.applyDeadline} />
          </div>

          {/* Description */}
          <Section title="Job Description">
            <p className="whitespace-pre-line text-neutral-700">
              {job.description}
            </p>
          </Section>

          {/* Eligibility */}
          {job.eligibility && (
            <Section title="Eligibility Criteria">
              <p>{job.eligibility}</p>
            </Section>
          )}

          {/* Total Posts */}
          {job.totalPost && (
            <Section title="Total Posts">
              <div className="text-center text-3xl font-bold">
                {job.totalPost}
              </div>
            </Section>
          )}

          {/* Vacancy Details */}
          {job.postClassification?.length > 0 && (
            <Section title="Vacancy Details">
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-neutral-100">
                    <tr>
                      <th className="border p-2 text-left">Post</th>
                      <th className="border p-2 text-left">Posts</th>
                      <th className="border p-2 text-left">Eligibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.postClassification.map((p, i) => (
                      <tr key={i}>
                        <td className="border p-2">{p.postName}</td>
                        <td className="border p-2">{p.numberOfPosts}</td>
                        <td className="border p-2">
                          {p.eligibilityCriteria?.join(", ") || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Filling Procedure */}
          {job.fillingProcedure?.length > 0 && (
            <Section title="How to Apply">
              <ul className="list-disc list-inside space-y-1">
                {job.fillingProcedure.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Important Links */}
          <Section title="Important Links">
            {job.importantLinks?.applyOnline && (
              <ImportantLink
                label="Apply Online"
                url={job.importantLinks.applyOnline}
              />
            )}
            {job.importantLinks?.officialNotification && (
              <ImportantLink
                label="Official Notification"
                url={job.importantLinks.officialNotification}
              />
            )}
            {job.importantLinks?.officialWebsite && (
              <ImportantLink
                label="Official Website"
                url={job.importantLinks.officialWebsite}
              />
            )}
          </Section>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href={job.applyLink}
              target="_blank"
              className="px-6 py-3 text-white rounded text-center cursor-pointer"
              style={{ backgroundColor: PRIMARY }}
            >
              Apply Now
            </a>
            <button className="border px-6 py-3 rounded cursor-pointer">
              Save for Later
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Related icon={BookOpen} title="Syllabus" />
        <Related icon={Award} title="Answer Keys" />
        <Related icon={CheckSquare} title="Results" />
      </div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

const Section = ({ title, children }) => (
  <div className="border-t pt-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const Meta = ({ icon: Icon, label, value }) => (
  <div className="flex items-center">
    <Icon size={20} className="mr-3 text-primary" />
    <div>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  </div>
);

const ImportantLink = ({ label, url }) => (
  <a
    href={url}
    target="_blank"
    className="flex items-center justify-between bg-neutral-50 p-3 rounded-lg hover:bg-neutral-100 mb-2"
  >
    <span>{label}</span>
    <ExternalLink size={16} />
  </a>
);

const Related = ({ title, icon: Icon }) => (
  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <div className="flex items-center mb-3">
      <Icon size={20} className="mr-2 text-primary" />
      <h3 className="font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-neutral-600">
      View related {title.toLowerCase()}.
    </p>
  </div>
);
