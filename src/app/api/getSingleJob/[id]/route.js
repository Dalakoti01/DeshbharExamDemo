import { connectDB } from "@/lib/db";
import AiProcessedJob from "@/models/AiProcessedJob";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const selectedJob = await AiProcessedJob.findById(id);

    if (!selectedJob) {
      return NextResponse.json(
        { message: "Job Not Found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Job fetched successfully",
        success: true,
        job: selectedJob,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
