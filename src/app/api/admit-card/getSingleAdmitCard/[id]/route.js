import { connectDB } from "@/lib/db";
import AiProcessedAdmitCard from "@/models/admitCard/AiProcessedAdmitCard";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const selectedAdmitCard = await AiProcessedAdmitCard.findById(id);
    return NextResponse.json(
      {
        message: "Admit Card fetched successfully",
        success: true,
        admitCard: selectedAdmitCard || {},
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 },
    );
  }
}
