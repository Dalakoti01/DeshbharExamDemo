import dotenv from "dotenv";
dotenv.config({});

import { connectDB } from "../lib/db.js";
import ScrapedAdmitCardDetail from "../models/admitCard/ScrapedAdmitCardDetail.js";

async function modifyIsProcessed() {
  try {
    await connectDB();

    const results = await ScrapedAdmitCardDetail.updateMany(
      {}, // match all documents
      { $set: { isProcessed: true } }
    );

    console.log("Updated:", results.modifiedCount);

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

modifyIsProcessed();