"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, X } from "lucide-react";
import { useSelector } from "react-redux";
import JobCard from "../shared/JobCard";
import useGetAllJobs from "@/hooks/jobs/useGetAllJobs";

const PRIMARY = "#6ec1d1";

export default function JobListingsPage() {
  useGetAllJobs();

  const { allJobs } = useSelector((store) => store.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  /* ---------- Dynamic Filtered Jobs ---------- */
  const filteredJobs = useMemo(() => {
    if (!allJobs || allJobs.length === 0) return [];

    return allJobs.filter((job) => {
      const titleMatch = job.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const categoryMatch = selectedCategory
        ? job.title?.toLowerCase().includes(selectedCategory.toLowerCase())
        : true;

      const locationMatch = selectedLocation
        ? selectedLocation === "All India"
          ? true
          : job.location?.state
              ?.toLowerCase()
              .includes(selectedLocation.toLowerCase())
        : true;

      return titleMatch && categoryMatch && locationMatch;
    });
  }, [allJobs, searchQuery, selectedCategory, selectedLocation]);

  /* ---------- Derived Filter Values ---------- */
  const categories = ["SSC", "Banking", "Railway", "Defence"];
  const locations = [
    "All India",
    ...new Set(allJobs?.map((j) => j.location?.state).filter(Boolean)),
  ];

  /* ---------- Clear Filters ---------- */
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLocation("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Latest Job Listings
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* ================= LEFT PANEL ================= */}
        <aside className="md:w-1/3 lg:w-1/4 w-full">
          {/* Search Card */}
          <div className="bg-white border rounded-xl shadow-sm mb-4">
            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2"
                  style={{ borderColor: PRIMARY }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Search size={18} />
                </span>
              </div>

              <button
                onClick={() => setShowFilters((p) => !p)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition cursor-pointer"
                style={{ borderColor: PRIMARY, color: PRIMARY }}
              >
                <Filter size={16} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white border rounded-xl shadow-sm animate-fade-in">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-800">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="flex items-center text-sm font-medium cursor-pointer"
                    style={{ color: PRIMARY }}
                  >
                    <X size={14} className="mr-1" /> Clear All
                  </button>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: PRIMARY }}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: PRIMARY }}
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ================= JOB LIST ================= */}
        <section className="flex-1">
          {/* Meta */}
          <p className="text-gray-600 mb-4 text-sm">
            Found {filteredJobs.length} jobs
          </p>

          {/* Grid */}
          {filteredJobs.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-10">
              No jobs found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
