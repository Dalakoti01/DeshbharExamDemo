import { connectDB } from "@/lib/db";
import AiProcessedResult from "@/models/result/AiProcessedResult";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const allResults = await AiProcessedResult.find().sort({ createdAt: -1 });
    return NextResponse.json(
      {
        message: "All Jobs Fetched Successfully",
        success: true,
        allResults: allResults || [],
      },
      { status: 200 },
    );
  } catch (error) {
    console.log();
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 },
    );
  }
}
