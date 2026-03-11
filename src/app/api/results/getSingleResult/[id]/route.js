import { connectDB } from "@/lib/db";
import AiProcessedResult from "@/models/result/AiProcessedResult";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const selectedResult = await AiProcessedResult.findById(id);
    return NextResponse.json(
      {
        message: "Result fetched successfully",
        success: true,
        result: selectedResult || {},
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching the result.",
        success: false,
      },
      { status: 500 },
    );
  }
}
