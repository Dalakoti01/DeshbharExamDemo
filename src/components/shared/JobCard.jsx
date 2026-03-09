import Link from "next/link";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

const PRIMARY = "#6ec1d1";

export default function JobCard({ job }) {
  if (!job) return null;

  const {
    _id,
    title,
    location,
    importantDates,
    importantLinks,
  } = job;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    let parsedDate;

    // Handle DD/MM/YYYY or DD-MM-YYYY
    if (dateStr.includes("/") || dateStr.includes("-")) {
      const parts = dateStr.split(/[\/-]/);

      if (parts.length === 3) {
        const [day, month, year] = parts;

        // if year is last (DD/MM/YYYY)
        if (year.length === 4) {
          parsedDate = new Date(`${year}-${month}-${day}`);
        } else {
          parsedDate = new Date(dateStr);
        }
      }
    }

    // Try normal parsing (for "07 March 2026")
    if (!parsedDate || isNaN(parsedDate)) {
      parsedDate = new Date(dateStr);
    }

    // Final fallback
    if (isNaN(parsedDate)) return dateStr;

    return parsedDate.toLocaleDateString("en-IN");
  };

  return (
    <div className="bg-white border rounded-lg p-3 hover:shadow-md transition">
      <h3 className="text-xs font-semibold mb-1 line-clamp-2">
        <Link href={`/job/${_id}`} className="hover:underline">
          {title}
        </Link>
      </h3>

      <div className="text-[10px] text-gray-600 space-y-1">
        <span className="flex items-center">
          <MapPin size={10} className="mr-1" />
          {location?.state || "All India"}
        </span>

        {importantDates?.applicationDeadline && (
          <span className="flex items-center">
            <Calendar size={10} className="mr-1" />
            Last Date: {formatDate(importantDates.applicationDeadline)}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center mt-2 pt-2 border-t text-[10px]">
        <Link
          href={`/job/${_id}`}
          style={{ color: PRIMARY }}
          className="flex items-center"
        >
          Details <ExternalLink size={10} className="ml-1" />
        </Link>

        {importantLinks?.applyOnline && (
          <a
            href={importantLinks.applyOnline}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            Apply
          </a>
        )}
      </div>
    </div>
  );
}