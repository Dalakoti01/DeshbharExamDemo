"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/register", formData);
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data?.message || "Registered successfully");
        router.push("/verify-email?from=register");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6ec1d1]/20 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#6ec1d1]"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#6ec1d1]"
          />

          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#6ec1d1]"
          />

          {/* Password Field with Eye */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 rounded-lg border focus:ring-2 focus:ring-[#6ec1d1]"
            />
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#6ec1d1] text-white font-semibold hover:opacity-90 transition cursor-pointer"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#6ec1d1] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
