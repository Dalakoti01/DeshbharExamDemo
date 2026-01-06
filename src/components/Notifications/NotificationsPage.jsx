"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  FileText,
  Briefcase,
  Check,
} from "lucide-react";
import { mockNotifications } from "@/data/mockData";

const PRIMARY = "#6ec1d1";

export default function NotificationsPage() {
  const [filter, setFilter] = useState(null);

  const filteredNotifications = filter
    ? mockNotifications.filter((n) => n.type === filter)
    : mockNotifications;

  const getIcon = (type) => {
    switch (type) {
      case "job":
        return <Briefcase size={18} style={{ color: PRIMARY }} />;
      case "result":
        return <CheckCircle size={18} className="text-green-600" />;
      case "admitCard":
        return <FileText size={18} className="text-purple-600" />;
      case "system":
        return <AlertCircle size={18} className="text-orange-500" />;
      default:
        return <Bell size={18} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Notifications
        </h1>

        <button
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md cursor-pointer"
          style={{ backgroundColor: PRIMARY }}
        >
          <Check size={16} />
          Mark All as Read
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: null, label: "All" },
          { key: "job", label: "Jobs" },
          { key: "result", label: "Results" },
          { key: "admitCard", label: "Admit Cards" },
          { key: "system", label: "System" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setFilter(item.key)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === item.key
                ? "text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
            style={
              filter === item.key ? { backgroundColor: PRIMARY } : {}
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell size={48} className="text-neutral-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">
            No notifications
          </h2>
          <p className="text-neutral-600">
            {filter
              ? `You don't have any ${filter} notifications yet.`
              : "You don't have any notifications yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border border-neutral-200 p-4 shadow-sm transition cursor-pointer ${
                notification.isRead
                  ? "bg-white"
                  : "bg-[#6ec1d11a] border-l-4"
              }`}
              style={
                !notification.isRead
                  ? { borderLeftColor: PRIMARY }
                  : {}
              }
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="rounded-full bg-white p-2 shadow-sm">
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-medium text-neutral-900">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-neutral-500 whitespace-nowrap">
                      {notification.date}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-700 mt-1">
                    {notification.message}
                  </p>

                  {notification.link && (
                    <Link
                      href={notification.link}
                      className="inline-block mt-2 text-sm font-medium"
                      style={{ color: PRIMARY }}
                    >
                      View Details
                    </Link>
                  )}
                </div>

                {/* Unread Dot */}
                {!notification.isRead && (
                  <span
                    className="mt-2 h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PRIMARY }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
