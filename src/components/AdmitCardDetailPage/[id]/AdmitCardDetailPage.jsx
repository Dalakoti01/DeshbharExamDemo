"use client";

import Link from "next/link";
import { Calendar, Clock, ExternalLink, ChevronLeft } from "lucide-react";

export default function AdmitCardDetailPage() {

  // Static placeholder data (replace later with dynamic data)
  const admitCard = {
    id: "1",
    examName: "UP Police SI Written Test 2025",
    examDate: "2025-02-15",
    organization: "Uttar Pradesh Police Recruitment & Promotion Board",
    totalPosts: "4543",
    admitCardDate: "2025-01-10",
    downloadLink: "https://uppbpb.gov.in/admit-cards",
    date: "2025-01-10",
  };

  const relatedJob = {
    applyStartDate: "2024-12-01",
    lastDate: "2024-12-31",
    applicationFee: {
      general: "₹400",
      scSt: "₹200",
    },
    ageLimit: {
      min: "21 Years",
      max: "28 Years",
    },
    officialNotificationLink: "#",
    officialWebsite: "https://uppbpb.gov.in",
    vacancyDetails: [
      {
        postName: "Sub Inspector (SI)",
        eligibility:
          "Graduate degree in any discipline from a recognized university",
      },
      {
        postName: "Platoon Commander",
        eligibility:
          "Graduate degree in any discipline from a recognized university",
      },
      {
        postName: "Constable",
        eligibility: "10+2 pass or equivalent from a recognized board",
      },
    ],
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;

    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const postDate = formatDate(admitCard.date || admitCard.admitCardDate);
  const postTime = "6:25 pm";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/admit-cards"
          className="text-neutral-600 hover:text-primary flex items-center text-sm"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Admit Cards
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white shadow-sm border border-neutral-200 rounded-xl mb-6">
        <div className="p-6">

          {/* Post Date */}
          <div className="text-sm text-neutral-500 mb-4">
            Post Date: {postDate} {postTime}
          </div>

          {/* Title */}
          <div className="mb-4 pb-4 border-b border-neutral-200">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
              {admitCard.examName}
            </h1>
            <p className="text-lg text-neutral-700">
              {admitCard.organization}
            </p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            <div className="flex items-center">
              <Calendar size={20} className="mr-3 text-primary" />
              <div>
                <p className="text-sm text-neutral-500">Exam Date</p>
                <p className="font-medium">
                  {formatDate(admitCard.examDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Clock size={20} className="mr-3 text-primary" />
              <div>
                <p className="text-sm text-neutral-500">Admit Card Release</p>
                <p className="font-medium">
                  {formatDate(admitCard.admitCardDate)}
                </p>
              </div>
            </div>

          </div>

          {/* Description */}
          <div className="border-t border-neutral-200 pt-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>

            <p className="text-neutral-700 leading-relaxed">
              <strong>{admitCard.organization}</strong> has released the admit
              card for <strong>{admitCard.examName}</strong>. The examination is
              scheduled to be conducted on{" "}
              <strong>{formatDate(admitCard.examDate)}</strong>. Candidates who
              have successfully applied for this examination can download their
              admit cards from the official website using their Registration
              Number, Application Number, or Date of Birth.
            </p>
          </div>

          {/* Important Dates */}
          <div className="border-t border-neutral-200 pt-6 mb-6">

            <h2 className="text-xl font-semibold mb-4">Important Dates</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-neutral-50 p-4 rounded-lg">
                <p className="text-sm text-neutral-500 mb-1">
                  Online Apply Start Date
                </p>
                <p className="font-semibold">
                  {formatDate(relatedJob.applyStartDate)}
                </p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg">
                <p className="text-sm text-neutral-500 mb-1">
                  Online Apply Last Date
                </p>
                <p className="font-semibold">
                  {formatDate(relatedJob.lastDate)}
                </p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg">
                <p className="text-sm text-neutral-500 mb-1">Exam Date</p>
                <p className="font-semibold">
                  {formatDate(admitCard.examDate)}
                </p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg">
                <p className="text-sm text-neutral-500 mb-1">
                  Admit Card Release Date
                </p>
                <p className="font-semibold">
                  {formatDate(admitCard.admitCardDate)}
                </p>
              </div>

            </div>
          </div>

          {/* Application Fee */}
          <div className="border-t border-neutral-200 pt-6 mb-6">

            <h2 className="text-xl font-semibold mb-4">Application Fee</h2>

            <div className="overflow-x-auto">

              <table className="w-full border border-neutral-300">

                <tbody>

                  <tr className="border-b bg-neutral-50">
                    <td className="border p-3 text-sm font-semibold w-1/3">
                      General / OBC
                    </td>
                    <td className="border p-3 text-sm">
                      <strong>{relatedJob.applicationFee.general}</strong>
                    </td>
                  </tr>

                  <tr className="bg-neutral-50">
                    <td className="border p-3 text-sm font-semibold">
                      SC / ST / Female
                    </td>
                    <td className="border p-3 text-sm">
                      <strong>{relatedJob.applicationFee.scSt}</strong>
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </div>

          {/* Age Limit */}
          <div className="border-t border-neutral-200 pt-6 mb-6">

            <h2 className="text-xl font-semibold mb-4">Age Limits</h2>

            <div className="bg-neutral-50 p-4 rounded-lg space-y-2">

              <p className="text-sm">
                <strong>Minimum Age :</strong> {relatedJob.ageLimit.min}
              </p>

              <p className="text-sm">
                <strong>Maximum Age :</strong> {relatedJob.ageLimit.max}
              </p>

            </div>

          </div>

          {/* Educational Eligibility */}
          <div className="border-t border-neutral-200 pt-6 mb-6">

            <h2 className="text-xl font-semibold mb-4">
              Educational Eligibility Criteria
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full border border-neutral-300">

                <thead>
                  <tr className="bg-primary/10">
                    <th className="border p-3 text-left text-sm font-semibold">
                      Post Name
                    </th>
                    <th className="border p-3 text-left text-sm font-semibold">
                      Educational Eligibility
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {relatedJob.vacancyDetails.map((vacancy, index) => (
                    <tr
                      key={index}
                      className="bg-neutral-50 hover:bg-neutral-100"
                    >
                      <td className="border p-3 text-sm">
                        {vacancy.postName}
                      </td>
                      <td className="border p-3 text-sm">
                        {vacancy.eligibility}
                      </td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* Important Links */}
          <div className="border-t border-neutral-200 pt-6">

            <h2 className="text-xl font-semibold mb-4">
              Some Useful Important Links
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full border border-neutral-300">

                <tbody>

                  <tr className="border-b bg-neutral-50 hover:bg-neutral-100">

                    <td className="border p-3 text-sm font-semibold w-1/3">
                      Download Admit Card
                    </td>

                    <td className="border p-3 text-sm">
                      <a
                        href={admitCard.downloadLink}
                        target="_blank"
                        className="text-primary hover:underline font-medium"
                      >
                        Click Here
                        <ExternalLink
                          size={14}
                          className="inline ml-1"
                        />
                      </a>
                    </td>

                  </tr>

                  <tr className="border-b bg-neutral-50 hover:bg-neutral-100">

                    <td className="border p-3 text-sm font-semibold">
                      Official Notification
                    </td>

                    <td className="border p-3 text-sm">
                      <a
                        href={relatedJob.officialNotificationLink}
                        className="text-primary hover:underline font-medium"
                      >
                        Click Here
                        <ExternalLink
                          size={14}
                          className="inline ml-1"
                        />
                      </a>
                    </td>

                  </tr>

                  <tr className="bg-neutral-50 hover:bg-neutral-100">

                    <td className="border p-3 text-sm font-semibold">
                      Official Website
                    </td>

                    <td className="border p-3 text-sm">
                      <a
                        href={relatedJob.officialWebsite}
                        className="text-primary hover:underline font-medium"
                      >
                        Click Here
                        <ExternalLink
                          size={14}
                          className="inline ml-1"
                        />
                      </a>
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-8">

        <p className="text-neutral-600 mb-3">
          Looking for more admit cards? Browse all available admit cards.
        </p>

        <Link
          href="/admit-cards"
          className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 cursor-pointer"
        >
          Explore More Admit Cards
        </Link>

      </div>

    </div>
  );
}