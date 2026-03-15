import { connectDB } from "@/lib/db";
import AiProcessedAdmitCard from "@/models/admitCard/AiProcessedAdmitCard";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();
        const allAdmitCards = await AiProcessedAdmitCard.find().sort({ createdAt: -1 });
        return NextResponse.json({message : "All Admit Cards fetched successfully",success : true, allAdmitCards : allAdmitCards || []}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({message : "Internal Server Error",success : false}, { status: 500 });
    }
}