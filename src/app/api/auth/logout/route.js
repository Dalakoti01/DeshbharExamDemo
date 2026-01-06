import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Get cookies store
    console.log("Logout API called");
    const cookieStore = await cookies();

    // Clear the JWT token cookie by setting it with past expiry
    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",     // must match the original cookie path
      expires: new Date(0), // expire immediately
    });

    cookieStore.set("role", "", {
  httpOnly: false, // keep same setting as when you set it
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/", // must match the original cookie path
  expires: new Date(0), // expire immediately
});

    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
