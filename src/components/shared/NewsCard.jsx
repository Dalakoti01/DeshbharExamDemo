import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";

const PRIMARY = "#6ec1d1";

export default function NewsCard() {
  return (
    <div className="bg-white border rounded-lg p-3 hover:shadow-md transition">
      <h3 className="text-sm font-medium line-clamp-2 mb-2">
        <Link href="#" className="hover:underline">
          SSC CGL 2025 Notification Released
        </Link>
      </h3>

      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center text-gray-500">
          <Calendar size={12} className="mr-1" /> 12 Sep 2025
        </span>
        <Link href="#" style={{ color: PRIMARY }} className="flex items-center">
          Read <ExternalLink size={12} className="ml-1" />
        </Link>
      </div>
    </div>
  );
}
