"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ChevronLeft } from "lucide-react";
import useGetSingleResult from "@/hooks/result/useGetSingleResult";
import { useSelector } from "react-redux";

export default function ResultDetailPage() {
  const params = useParams();
  const id = params?.id;

  useGetSingleResult(id);

  const { singleResult } = useSelector((store) => store.auth);

  /* ---------- Extract Arrays ---------- */

  const importantDates = singleResult?.importantDates?.[0] || {};
  const importantLinks = singleResult?.importantLinks?.[0] || {};

  /* ---------- Date Formatter ---------- */

  const formatDate = (dateString) => {
    if (!dateString) return "";

    if (
      dateString?.toLowerCase()?.includes("before") ||
      dateString?.toLowerCase()?.includes("after")
    ) {
      return dateString;
    }

    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;

    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!singleResult) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="card p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Result Not Found</h2>
          <p className="text-neutral-600 mb-6">
            The result you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/results" className="btn btn-primary">
            Browse All Results
          </Link>
        </div>
      </div>
    );
  }

  const postDate = formatDate(
    singleResult?.resultDate ||
      importantDates?.resultDate ||
      singleResult?.createdAt
  );

  const hasDates =
    Object.keys(importantDates).length > 0 ||
    (singleResult?.otherDates && singleResult?.otherDates.length > 0);

  const hasLinks =
    Object.keys(importantLinks).length > 0 ||
    (singleResult?.otherLinks && singleResult?.otherLinks.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Back Button */}

      <div className="mb-6">
        <Link
          href="/results"
          className="text-neutral-600 hover:text-primary flex items-center text-sm"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Results
        </Link>
      </div>

      <div className="card mb-6">
        <div className="p-6">

          {/* Post Date */}

          <div className="text-sm text-neutral-500 mb-4">
            Post Date: {postDate}
          </div>

          {/* Title */}

          <div className="mb-4 pb-4 border-b border-neutral-200">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
              {singleResult.examName}
            </h1>
          </div>

          {/* Description */}

          {singleResult.description && (
            <div className="border-b border-neutral-200 pb-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-lg text-neutral-700">
                {singleResult.description}
              </p>
            </div>
          )}

          {/* RESULT TITLE */}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              {singleResult.examName} – Result Out
            </h2>
          </div>

          {/* IMPORTANT DATES */}

          {hasDates && (
            <div className="mb-6">

              <h3 className="text-xl font-semibold mb-4">
                Important Dates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {importantDates.examDate && (
                  <DateCard label="Exam Date" value={importantDates.examDate} />
                )}

                {importantDates.resultDate && (
                  <DateCard label="Result Declared" value={importantDates.resultDate} />
                )}

                {importantDates.admitCardsDate && (
                  <DateCard label="Admit Card Date" value={importantDates.admitCardsDate} />
                )}

                {importantDates.applicationDeadline && (
                  <DateCard label="Last Date" value={importantDates.applicationDeadline} />
                )}

                {importantDates.lastDateToPayFees && (
                  <DateCard
                    label="Last Date To Pay Fees"
                    value={importantDates.lastDateToPayFees}
                  />
                )}

                {/* OTHER DATES */}

                {singleResult?.otherDates?.map((date, index) => (
                  <DateCard
                    key={index}
                    label={date.linkName}
                    value={date.linkUrl}
                  />
                ))}

              </div>
            </div>
          )}

          {/* IMPORTANT LINKS */}

          {hasLinks && (
            <div className="border-t border-neutral-200 pt-6 mb-6">

              <h2 className="text-2xl font-semibold mb-4">
                SOME USEFUL IMPORTANT LINKS
              </h2>

              <table className="w-full border border-neutral-300">

                <tbody>

                  {importantLinks.downloadResult && (
                    <LinkRow
                      label="Download Result"
                      url={importantLinks.downloadResult}
                    />
                  )}

                  {importantLinks.downloadNotification && (
                    <LinkRow
                      label="Download Notification"
                      url={importantLinks.downloadNotification}
                    />
                  )}

                  {importantLinks.downloadAdmitCard && (
                    <LinkRow
                      label="Download Admit Card"
                      url={importantLinks.downloadAdmitCard}
                    />
                  )}

                  {importantLinks.downloadExamNotice && (
                    <LinkRow
                      label="Download Exam Notice"
                      url={importantLinks.downloadExamNotice}
                    />
                  )}

                  {importantLinks.downloadInterviewLetter && (
                    <LinkRow
                      label="Download Interview Letter"
                      url={importantLinks.downloadInterviewLetter}
                    />
                  )}

                  {importantLinks.downloadAnswerKey && (
                    <LinkRow
                      label="Download Answer Key"
                      url={importantLinks.downloadAnswerKey}
                    />
                  )}

                  {importantLinks.downloadPreResult && (
                    <LinkRow
                      label="Download Pre Result"
                      url={importantLinks.downloadPreResult}
                    />
                  )}

                  {importantLinks.downloadMainResult && (
                    <LinkRow
                      label="Download Main Result"
                      url={importantLinks.downloadMainResult}
                    />
                  )}

                  {importantLinks.downloadMeritList && (
                    <LinkRow
                      label="Download Merit List"
                      url={importantLinks.downloadMeritList}
                    />
                  )}

                  {importantLinks.officialWebsite && (
                    <LinkRow
                      label="Official Website"
                      url={importantLinks.officialWebsite}
                    />
                  )}

                  {/* OTHER LINKS */}

                  {singleResult?.otherLinks?.map((link, index) => (
                    <LinkRow
                      key={index}
                      label={link.linkName}
                      url={link.linkUrl}
                    />
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>
      </div>

      <div className="text-center mt-8">

        <p className="text-neutral-600 mb-3">
          Looking for more results? Browse all exam results.
        </p>

        <Link href="/results" className="btn btn-primary">
          Explore More Results
        </Link>

      </div>

    </div>
  );
}

/* ---------- Helper Components ---------- */

function DateCard({ label, value }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;

    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-neutral-50 p-3 rounded-lg">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="font-semibold">{formatDate(value)}</p>
    </div>
  );
}

function LinkRow({ label, url }) {
  return (
    <tr className="border-b border-neutral-300 bg-neutral-50">

      <td className="border p-3 text-sm font-semibold w-1/3">
        {label}
      </td>

      <td className="border p-3 text-sm">

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Click Here
          <ExternalLink size={14} className="inline ml-1" />
        </a>

      </td>

    </tr>
  );
}