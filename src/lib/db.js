// lib/db.js
import mongoose from "mongoose";

let isConnected = false; // To track the connection status

export async function connectDB() {
  if (isConnected) {
    console.log("✅ MongoDB is already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, );

    isConnected = true;
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
}
