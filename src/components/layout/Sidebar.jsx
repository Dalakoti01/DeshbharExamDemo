"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Briefcase,
  FileText,
  Award,
  CheckSquare,
  BookOpen,
  Bell,
  User,
  TrendingUp,
  Clock,
  Star,
  Calendar,
  Bookmark,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import toast from "react-hot-toast";

// shadcn
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PRIMARY = "#6ec1d1";

export default function Sidebar({ onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);
  const language = "en";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    onToggle?.(isCollapsed);
  }, [isCollapsed, onToggle]);

  const toggleSidebar = () => setIsCollapsed((p) => !p);

  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/auth/logout");
      if (res.data.success) {
        toast.success(res.data.message || "Logged out successfully");
        dispatch(setUser(null));
        router.push("/");
      }
    } catch (err) {
      toast.error("Logout failed");
    } finally {
      setOpenLogoutDialog(false);
    }
  };

  const navigationItems = [
    { path: "/", icon: Home, label: language === "en" ? "Home" : "होम" },
    {
      path: "/jobs",
      icon: Briefcase,
      label: language === "en" ? "Jobs" : "नौकरियां",
    },
    {
      path: "/results",
      icon: CheckSquare,
      label: language === "en" ? "Results" : "परिणाम",
    },
    {
      path: "/admit-cards",
      icon: FileText,
      label: language === "en" ? "Admit Cards" : "प्रवेश पत्र",
    },
    {
      path: "/answer-keys",
      icon: Award,
      label: language === "en" ? "Answer Keys" : "उत्तर कुंजी",
    },
    {
      path: "/syllabus",
      icon: BookOpen,
      label: language === "en" ? "Syllabus" : "पाठ्यक्रम",
    },
  ];

  const quickActions = [
    {
      icon: TrendingUp,
      label: language === "en" ? "Trending Jobs" : "ट्रेंडिंग नौकरियां",
      count: "12",
    },
    {
      icon: Clock,
      label: language === "en" ? "Recent Updates" : "हाल के अपडेट",
      count: "5",
    },
    {
      icon: Star,
      label: language === "en" ? "Saved Items" : "सहेजे गए आइटम",
      count: "8",
    },
    {
      icon: Calendar,
      label: language === "en" ? "Upcoming Exams" : "आगामी परीक्षाएं",
      count: "3",
    },
  ];

  return (
    <>
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r shadow-lg z-40 transition-all duration-300
        ${isCollapsed ? "w-16" : "w-64"}
        ${isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0"}`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-4 bg-[#6ec1d1] text-white p-1.5 rounded-full shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
          style={{ backgroundColor: PRIMARY }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="p-4 h-full overflow-y-auto">
          {/* User Profile */}
          {user && (
            <div className={`mb-6 ${isCollapsed ? "text-center" : ""}`}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: PRIMARY }}
                >
                  <User size={20} className="text-white" />
                </div>
                {!isCollapsed && (
                  <div>
                    <p className="font-semibold text-sm text-gray-800">
                      {user.fullName || user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mb-6">
            <h3
              className={`font-semibold text-gray-700 mb-3 ${
                isCollapsed ? "sr-only" : ""
              }`}
            >
              {language === "en" ? "Navigation" : "नेविगेशन"}
            </h3>

            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer
  ${
    isActive
      ? "bg-[#6ec1d1] text-white shadow-md"
      : "text-gray-600 hover:bg-gray-100 hover:text-[#6ec1d1] hover:shadow-sm"
  }`}
                    style={{
                      backgroundColor: isActive ? PRIMARY : "transparent",
                      color: isActive ? "#ffffff" : "#4b5563",
                    }}
                  >
                    <Icon
                      size={20}
                      className={isActive ? "text-white" : "text-[#6ec1d1]"}
                    />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                );
              })}

              {/* Logout below News */}
              {user && (
                <button
                  onClick={() => setOpenLogoutDialog(true)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <LogOut size={20} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">Logout</span>
                  )}
                </button>
              )}
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3
              className={`font-semibold text-gray-700 mb-3 ${
                isCollapsed ? "sr-only" : ""
              }`}
            >
              {language === "en" ? "Quick Actions" : "त्वरित कार्य"}
            </h3>

            <div className="space-y-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg 
bg-gradient-to-r from-gray-50 to-gray-100 
hover:from-gray-100 hover:to-gray-200 
transition-all duration-200 cursor-pointer border"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className="text-[#6ec1d1]" />{" "}
                      {!isCollapsed && (
                        <span className="text-sm font-medium text-gray-700">
                          {action.label}
                        </span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <span
                        className="text-white text-xs px-2 py-1 rounded-full font-semibold"
                        style={{ backgroundColor: PRIMARY }}
                      >
                        {action.count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          {!isCollapsed && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                {language === "en" ? "Recent Activity" : "हाल की गतिविधि"}
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100">
                  <p className="font-semibold">SSC GD 2024</p>
                  <p>Application deadline extended</p>
                  <p className="text-gray-500 mt-1">2 hours ago</p>
                </div>
                <div className="p-3 rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100">
                  <p className="font-semibold">UPSC CSE 2024</p>
                  <p>Prelims result declared</p>
                  <p className="text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          {!isCollapsed && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">
                {language === "en" ? "Quick Links" : "त्वरित लिंक"}
              </h3>

              <div className="space-y-1">
                <QuickLink
                  href="/notifications"
                  icon={Bell}
                  label="Notifications"
                />
                <QuickLink href="/profile" icon={User} label="Profile" />
                <QuickLink
                  href="/bookmarks"
                  icon={Bookmark}
                  label="Bookmarks"
                />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Logout Dialog */}
      <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function QuickLink({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-600 
hover:bg-gray-100 hover:text-[#6ec1d1] transition-all duration-200 cursor-pointer"    >
      <Icon size={16} style={{ color: "#6ec1d1" }} />
      <span className="font-medium">{label}</span>
    </Link>
  );
}
