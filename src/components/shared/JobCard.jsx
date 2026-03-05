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
            Last Date:{" "}
            {new Date(
              importantDates.applicationDeadline
            ).toLocaleDateString()}
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
