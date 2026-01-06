"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <GraduationCap size={24} className="text-primary mr-2" />
              <span className="font-semibold text-lg text-neutral-900">
                Exam<span className="text-primary">Info</span>
              </span>
            </div>

            <p className="text-neutral-600 text-sm leading-relaxed">
              Your one-stop platform for all government exam notifications,
              job listings, results, and more.
            </p>

            <div className="flex space-x-4 mt-4">
              {[Facebook, Twitter, Instagram, Linkedin].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-neutral-500 hover:text-primary transition cursor-pointer"
                  >
                    <Icon size={20} />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase mb-4 tracking-wider">
              Resources
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/jobs" label="Latest Jobs" />
              <FooterLink href="/results" label="Results" />
              <FooterLink href="/admit-cards" label="Admit Cards" />
              <FooterLink href="/syllabus" label="Syllabus" />
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase mb-4 tracking-wider">
              Support
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/contact" label="Contact" />
              <FooterLink href="/faq" label="FAQ" />
              <FooterLink href="/privacy-policy" label="Privacy Policy" />
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase mb-4 tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/news" label="Latest News" />
              <FooterLink href="/notifications" label="Notifications" />
              <FooterLink href="/answer-keys" label="Answer Keys" />
              <FooterLink href="/signup" label="Create Account" />
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-200 pt-6 mt-8 text-center">
          <p className="text-neutral-600 text-sm">
            © {new Date().getFullYear()} ExamInfo. Created by Manjit Chhonkar
          </p>
        </div>
      </div>
    </footer>
  );
}

/* Reusable Footer Link */
function FooterLink({ href, label }) {
  return (
    <li>
      <Link
        href={href}
        className="text-neutral-600 hover:text-primary text-sm transition cursor-pointer"
      >
        {label}
      </Link>
    </li>
  );
}
