import { NextResponse } from "next/server";
import { scrapeRojgarResult } from "../../../../../scripts/scrapeRojgarResults";

/* -------------------------------------------------
   In-memory lock to prevent overlapping executions
-------------------------------------------------- */
let isRunning = false;

export async function GET(req) {
  try {
    /* ------------------ AUTH CHECK ------------------ */
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("❌ CRON_SECRET not set in environment");
      return NextResponse.json(
        { success: false, message: "Server misconfiguration" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ------------------ LOCK CHECK ------------------ */
    if (isRunning) {
      console.warn("⚠️ Cron already running, skipping this run");
      return NextResponse.json(
        { success: false, message: "Cron already running" },
        { status: 429 }
      );
    }

    /* ------------------ ACQUIRE LOCK ------------------ */
    isRunning = true;
    console.log("⏰ Cron job started: scrapeRojgarResult");

    /* ------------------ EXECUTE JOB ------------------ */
    await scrapeRojgarResult();

    console.log("✅ Cron job completed successfully");

    return NextResponse.json(
      {
        success: true,
        message: "Scraping pipeline completed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Cron job failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  } finally {
    /* ------------------ RELEASE LOCK ------------------ */
    isRunning = false;
  }
}
