import dotenv from "dotenv";
dotenv.config({});

import { connectDB } from "../lib/db.js";
import AiProcessedResult from "../models/result/AiProcessedResult.js";

async function addLocationToResults() {
  try {
    await connectDB();

    const results = await AiProcessedResult.updateMany(
      { location: { $exists: false } },
      {
        $set: {
          location: {
            city: "",
            state: "",
          },
        },
      }
    );

    console.log("Updated:", results.modifiedCount);

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

addLocationToResults();