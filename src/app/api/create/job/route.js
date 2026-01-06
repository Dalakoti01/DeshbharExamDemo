import { connectDB } from "@/lib/db";
import { ingestAiJobs } from "../../../../../services/jobIngestionService.js";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectDB();
    const result = await ingestAiJobs();

    return NextResponse.json({
      success: true,
      message: "Job ingestion completed",
      summary: result,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
