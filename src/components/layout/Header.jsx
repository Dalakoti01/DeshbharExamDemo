"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Bell,
  Search,
  Mic,
  GraduationCap,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isImageToolsOpen, setIsImageToolsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const [language, setLanguage] = useState("en"); // UI only

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const { user } = useSelector((store) => store.auth || {});
  console.log("Current User:", user);
  const unreadCount = useSelector(
    (s) => s.notifications?.unreadCount || 0
  );

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#60aebe] ">
      {/* Top Bar */}
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="border-2 border-white rounded-xl px-4 py-1 shadow-md">
            <span className="text-3xl font-black lowercase tracking-tight">
              deshbhar
            </span>
          </div>
          <span className="hidden sm:block text-xl font-extrabold">
            exam
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {[
            // ["/age-calculator", "Age Calculator", "आयु कैलकुलेटर"],
            ["/answer-keys", "Answer Keys", "उत्तर कुंजी"],
            ["/syllabus", "Syllabus", "पाठ्यक्रम"],
            ["/news", "News", "समाचार"],
          ].map(([path, en, hi]) => (
            <Link
              key={path}
              href={path}
              className="px-4 py-2 rounded-xl font-semibold text-white hover:bg-white hover:text-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
            >
              {language === "en" ? en : hi}
            </Link>
          ))}

          {/* Image Tools */}
          <div className="relative">
            <button
              onClick={() => setIsImageToolsOpen(!isImageToolsOpen)}
              className="px-4 py-2 rounded-xl font-semibold hover:bg-white hover:text-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer flex items-center gap-1"
            >
              {language === "en"
                ? "Image Resize/Modify"
                : "छवि आकार/संशोधन"}
              <span
                className={`transition-transform ${
                  isImageToolsOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isImageToolsOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg border py-2 z-50">
                {[
                  ["image-resize", "Image Resize", "छवि आकार बदलें"],
                  ["image-to-pdf", "Image to PDF", "छवि से PDF"],
                  ["image-compress", "Image Compress", "छवि संपीड़न"],
                  ["image-convert", "Image Convert", "छवि रूपांतरण"],
                ].map(([path, en, hi]) => (
                  <Link
                    key={path}
                    href={`/${path}`}
                    onClick={() => setIsImageToolsOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-primary hover:text-white transition"
                  >
                    {language === "en" ? en : hi}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isHomePage && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl hover:bg-white hover:text-primary transition shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
            >
              <Search size={20} />
            </button>
          )}

          <Link
            href="/user/notifications"
            className="relative p-2 rounded-xl hover:bg-white hover:text-primary transition shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </Link>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-xl bg-white text-primary font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition cursor-pointer"
          >
            {language === "en" ? "हिंदी" : "ENG"}
          </button>

          {user ? (
            <Link
              href="/user/profile"
              className="p-2 rounded-xl hover:bg-white hover:text-primary transition shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
            >
              <User size={20} />
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex px-4 py-2 rounded-xl bg-primary-light text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition cursor-pointer"
            >
              {language === "en" ? "Sign In" : "साइन इन"}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white hover:text-primary transition shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-16 bg-white/95 backdrop-blur-lg border-b p-4 z-50">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto relative"
          >
            <input
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none shadow-sm"
              placeholder={
                language === "en"
                  ? "Search for exams, jobs, results..."
                  : "परीक्षाओं, नौकरियों, परिणामों के लिए खोजें..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsVoiceSearch(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Mic size={18} />
              </button>
              <button type="submit" className="p-2 text-primary">
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
