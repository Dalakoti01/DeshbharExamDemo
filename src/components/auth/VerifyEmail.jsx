"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(30);

  const searchParams = useSearchParams();
  const from = searchParams.get("from"); // "register" or "forget"

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const finalOtp = otp.join("");

      const res = await axios.post("/api/auth/verify-email", {
        email: user.email,
        otp: finalOtp,
      });

      if (res.data.success) {
        toast.success(res.data.message);

        if (from === "forget") {
          router.push("/reset-password");
        } else {
          router.push("/login");
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error verifying OTP:", error);
      toast.error(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const res = await axios.post("/api/resendOtp", { email: user.email });
    if (res.data.success) {
      toast.success(res.data.message);
    }
    setTimer(30);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        {/* Back Arrow */}
        <div className="flex items-center p-4">
          <Link href="/register">
            <ArrowLeft className="h-6 w-6 text-gray-600 cursor-pointer hover:text-[#6ec1d1]" />
          </Link>
        </div>

        <CardHeader className="text-center pt-0">
          <CardTitle className="text-2xl font-bold text-[#6ec1d1]">
            Verify Your Email
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">
            Enter the 6-digit code we sent to your email
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* OTP inputs */}
            <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6ec1d1] border-gray-300"
                />
              ))}
            </div>

            {/* Verify button */}
            {loading ? (
              <Button className="w-full bg-[#6ec1d1] text-white rounded-lg">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Please wait...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full cursor-pointer bg-[#6ec1d1] hover:opacity-90 text-white rounded-lg"
              >
                Verify Email
              </Button>
            )}

            {/* Resend OTP */}
            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={timer > 0}
                className="rounded-lg cursor-pointer w-full sm:w-auto"
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
