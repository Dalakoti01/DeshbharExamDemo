import { connectDB } from "@/lib/db";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Email/Phone and password are required", success: false },
        { status: 400 }
      );
    }

    // ✅ Detect email vs phone
    const isEmail = identifier.includes("@");

    const existingUser = await userModels.findOne(
      isEmail
        ? { email: identifier }
        : { phoneNumber: identifier }
    );

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found. Please register.", success: false },
        { status: 404 }
      );
    }

    if (!existingUser.verified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in", success: false },
        { status: 403 }
      );
    }

    if (existingUser.blocked) {
      return NextResponse.json(
        { message: "Your account has been blocked by the admin", success: false },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials", success: false },
        { status: 401 }
      );
    }

    // ✅ Remove password
    const userWithoutPassword = existingUser.toObject();
    delete userWithoutPassword.password;

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        success: true,
        token,
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
