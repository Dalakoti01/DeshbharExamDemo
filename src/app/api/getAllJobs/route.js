import { connectDB } from "@/lib/db";
import jobModels from "@/models/jobModels";
import { NextResponse } from "next/server";

export async function GET(req){
    try {
        await connectDB();
        const allJobs = await jobModels.find().sort({createdAt : -1});

        if(allJobs.length === 0 || !allJobs){
            return NextResponse.json({message : "No Jobs Found", success : false,jobs : allJobs},{status : 404})
        }

        console.log("All Jobs Fetched Successfully",allJobs.length);

        return NextResponse.json({jobs : allJobs, success : true,message : "All Jobs Fetched Successfully"},{status : 200})
    } catch (error) {
        return NextResponse.json({message : "Internal Server Error",success : false},{status : 500  })
    }
}