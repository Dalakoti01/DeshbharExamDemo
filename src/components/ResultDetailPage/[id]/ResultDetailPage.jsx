"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckSquare, ExternalLink, ChevronLeft } from "lucide-react";

export default function ResultDetailPage() {
  const params = useParams();
  const id = params?.id;

  const results = [
    {
      id: "1",
      examName: "UP Police SI Final Result 2025",
      resultType: "Final Result",
      organization: "Uttar Pradesh Police Recruitment & Promotion Board",
      totalPosts: "4543",
      resultDate: "2025-01-05",
      downloadLink: "https://uppbpb.gov.in/results",
      date: "2025-01-05",
      category: "Police",
      isNew: true,
    },
    {
      id: "2",
      examName: "Bihar Police Home Guard Result 2025",
      resultType: "Final Result",
      organization: "Bihar Police Department",
      totalPosts: "15000",
      resultDate: "2025-01-15",
      downloadLink: "https://bihar.gov.in/results",
      date: "2025-01-15",
      category: "Police",
      isNew: true,
    },
  ];

  const relatedJob = {
    applyStartDate: "2024-04-01",
    lastDate: "2024-05-01",
    examDate: "2024-09-15",
    admitCardDate: "Before Exam",

    applicationFee: {
      general: "₹400",
      scSt: "₹200",
    },

    ageLimit: {
      min: "21",
      max: "28",
      asOn: "01 July 2024",
    },

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
        eligibility: "10+2 pass from recognized board",
      },
    ],

    modeOfSelection: [
      "Written Examination",
      "Physical Efficiency Test",
      "Document Verification",
      "Medical Examination",
    ],

    officialWebsite: "https://uppbpb.gov.in",
    officialNotificationLink: "https://uppbpb.gov.in/notification",
  };

  const result = results.find((r) => r.id === id);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    if (
      dateString.toLowerCase().includes("before") ||
      dateString.toLowerCase().includes("after")
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

  if (!result) {
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

  const postDate = formatDate(result.date || result.resultDate);
  const postTime = "6:25 pm";

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
            Post Date: {postDate} {postTime}
          </div>

          {/* Title */}

          <div className="mb-4 pb-4 border-b border-neutral-200">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
              {result.examName}
            </h1>
            <p className="text-lg text-neutral-700">{result.organization}</p>
          </div>

          {/* Description */}

          <div className="border-b border-neutral-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>

            <p className="text-lg text-neutral-700">
              <strong>{result.organization}</strong>, The <strong>Result</strong>{" "}
              for the recruitment of{" "}
              <strong>{result.examName.replace(" Result", "")}</strong> has been
              released. The exam was conducted on{" "}
              <strong>{formatDate(result.resultDate)}</strong>.
            </p>
          </div>

          {/* OUT Heading */}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              {result.examName.replace(" Result", "")} {result.resultType} – Out
            </h2>
          </div>

          {/* Important Dates */}

          <div className="mb-6">

            <h3 className="text-xl font-semibold mb-4">Important Dates</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-neutral-50 p-3 rounded-lg">
                <p className="text-sm text-neutral-500">Apply Start Date</p>
                <p className="font-semibold">
                  {formatDate(relatedJob.applyStartDate)}
                </p>
              </div>

              <div className="bg-neutral-50 p-3 rounded-lg">
                <p className="text-sm text-neutral-500">Last Date</p>
                <p className="font-semibold">
                  {formatDate(relatedJob.lastDate)}
                </p>
              </div>

              <div className="bg-neutral-50 p-3 rounded-lg">
                <p className="text-sm text-neutral-500">Exam Date</p>
                <p className="font-semibold">
                  {formatDate(relatedJob.examDate)}
                </p>
              </div>

              <div className="bg-neutral-50 p-3 rounded-lg">
                <p className="text-sm text-neutral-500">Result Declared</p>
                <p className="font-semibold">
                  {formatDate(result.resultDate)}
                </p>
              </div>

            </div>
          </div>

          {/* Mode of Selection */}

          <div className="mb-6">

            <h3 className="text-xl font-semibold mb-4">
              Mode Of Selection
            </h3>

            <div className="bg-neutral-50 p-4 rounded-lg">

              {relatedJob.modeOfSelection.map((mode, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <CheckSquare size={16} className="mr-2 text-primary" />
                  <span className="text-sm font-semibold">{mode}</span>
                </div>
              ))}

            </div>

          </div>

          {/* Important Links */}

          <div className="border-t border-neutral-200 pt-6 mb-6">

            <h2 className="text-2xl font-semibold mb-4">
              SOME USEFUL IMPORTANT LINKS
            </h2>

            <table className="w-full border border-neutral-300">

              <tbody>

                <tr className="border-b border-neutral-300 bg-neutral-50">

                  <td className="border p-3 text-sm font-semibold w-1/3">
                    Download Result
                  </td>

                  <td className="border p-3 text-sm">

                    <a
                      href={result.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Click Here
                      <ExternalLink size={14} className="inline ml-1" />
                    </a>

                  </td>

                </tr>

                <tr className="bg-neutral-50">

                  <td className="border p-3 text-sm font-semibold">
                    Official Website
                  </td>

                  <td className="border p-3 text-sm">

                    <a
                      href={relatedJob.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Click Here
                      <ExternalLink size={14} className="inline ml-1" />
                    </a>

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

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