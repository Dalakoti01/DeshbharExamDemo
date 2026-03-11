import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FinalLayout from "@/components/layout/FinalLayout";
import Providers from "@/redux/Providers";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Deshbharexam - Your Gateway to Government Jobs",
  description: "Discover the latest government job notifications, exam updates, and career resources all in one place. Stay informed and never miss an opportunity with Deshbharexam.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <FinalLayout>
            <Toaster position="top-right" />

            {children}
          </FinalLayout>
        </Providers>
        x{" "}
      </body>
    </html>
  );
}
