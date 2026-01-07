"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";

export default function FinalLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* Detect mobile */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* Called by Sidebar */
  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  /* Optional: mobile toggle (future use if header triggers it) */
  const handleMobileSidebarToggle = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header onSidebarToggle={handleMobileSidebarToggle} />

      {/* Body */}
      <div className="flex flex-grow relative">
        {/* Sidebar */}
        <Sidebar onToggle={handleSidebarToggle} />

        {/* Main Content */}
        <main
          className={`flex-grow transition-all duration-300 pt-16
            ${
              isMobile
                ? "ml-0"
                : isSidebarCollapsed
                ? "ml-16"
                : "ml-64"
            }
          `}
        >
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
