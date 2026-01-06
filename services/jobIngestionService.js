import fs from "fs-extra";
import path from "path";
import Job from "../src/models/jobModels.js";

const AI_JOBS_FILE = path.join(process.cwd(), "data", "rojgar_ai_jobs.json");

/* =====================================================
   BASIC HELPERS
===================================================== */
function extractNumber(val) {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = Number(val);
    return isNaN(n) ? null : n;
  }
  if (typeof val === "object" && val !== null) {
    if (typeof val.total === "number") return val.total;
  }
  return null;
}

/* =====================================================
   AGE NORMALIZER → ALWAYS ageRangeSchema
===================================================== */
function normalizeAgeValue(value) {
  if (!value) return null;

  // already correct
  if (typeof value === "object" && !Array.isArray(value)) {
    return {
      rawText: value.rawText ?? null,
      min: value.min ?? null,
      max: value.max ?? null,
    };
  }

  // number
  if (typeof value === "number") {
    return {
      rawText: String(value),
      min: value,
      max: null,
    };
  }

  // string like "27-50"
  if (typeof value === "string") {
    const nums = value.match(/\d+/g)?.map(Number) || [];
    return {
      rawText: value,
      min: nums[0] ?? null,
      max: nums[1] ?? null,
    };
  }

  return null;
}

/* =====================================================
   FILLING PROCEDURE NORMALIZER (CRITICAL FIX)
===================================================== */
function normalizeFillingProcedure(value) {
  if (!value) return [];

  // already array of strings
  if (Array.isArray(value)) {
    return value.filter(v => typeof v === "string");
  }

  // stringified array → parse safely
  if (typeof value === "string") {
    const trimmed = value.trim();

    // try JSON parse
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter(v => typeof v === "string");
        }
      } catch {
        // fallback below
      }
    }

    // normal paragraph → split sentences
    return trimmed
      .split(/\.\s+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  return [];
}

/* =====================================================
   IMPORTANT LINKS NORMALIZER
===================================================== */
function normalizeImportantLinks(links) {
  let applyOnline = null;
  let notification = null;
  let officialWebsite = null;

  if (Array.isArray(links)) {
    for (const l of links) {
      if (!l) continue;
      const type = l.type || "";
      if (/apply/i.test(type)) applyOnline = l.href || l.url;
      if (/notification/i.test(type)) notification = l.href || l.url;
      if (/official/i.test(type)) officialWebsite = l.href || l.url;
    }
  } else if (typeof links === "object" && links !== null) {
    applyOnline = links.applyOnline || null;
    notification = links.officialNotification || null;
    officialWebsite = links.officialWebsite || null;
  }

  return {
    applyOnline,
    officialNotification: notification,
    officialWebsite,
  };
}

/* =====================================================
   CORE NORMALIZER → MATCHES MONGOOSE MODEL EXACTLY
===================================================== */
function normalizeAiJobForDb(job) {
  return {
    title: job.title ?? null,
    description: job.description ?? null,

    location: {
      city: job.location?.city ?? null,
      state: job.location?.state ?? null,
    },

    importantDates: {
      applicationDeadline: job.importantDates?.applicationDeadline ?? null,
      lastDateToPayFees: job.importantDates?.lastDateToPayFees ?? null,
      examDate: job.importantDates?.examDate ?? null,
      admitCardsDate: job.importantDates?.admitCardsDate ?? null,
    },

    importantLinks: {
      applyOnline: job.importantLinks?.applyOnline ?? null,
      officialNotification: job.importantLinks?.officialNotification ?? null,
      officialWebsite: job.importantLinks?.officialWebsite ?? null,
    },

    otherLinks: Array.isArray(job.otherLinks) ? job.otherLinks : [],

    applicationFees: {
      General: job.applicationFees?.General ?? null,
      OBC: job.applicationFees?.OBC ?? null,
      SC_ST: job.applicationFees?.SC_ST ?? null,
    },

    ageLimit: {
      lowerLimit: {
        General: job.ageLimit?.lowerLimit?.General ?? null,
        OBC: job.ageLimit?.lowerLimit?.OBC ?? null,
        SC_ST: job.ageLimit?.lowerLimit?.SC_ST ?? null,
      },
      upperLimit: {
        General: job.ageLimit?.upperLimit?.General ?? null,
        OBC: job.ageLimit?.upperLimit?.OBC ?? null,
        SC_ST: job.ageLimit?.upperLimit?.SC_ST ?? null,
      },
    },

    totalPost: job.totalPost ?? null,

    postClassification: Array.isArray(job.postClassification)
      ? job.postClassification
      : [],

    fillingProcedure: Array.isArray(job.fillingProcedure)
      ? job.fillingProcedure
      : [],
  };
}


/* =====================================================
   INGESTION
===================================================== */
export async function ingestAiJobs() {
  if (!(await fs.pathExists(AI_JOBS_FILE))) {
    return { inserted: 0, skipped: 0 };
  }

  const aiJobs = await fs.readJson(AI_JOBS_FILE);

  let inserted = 0;
  let skipped = 0;

  for (const job of aiJobs) {
    if (job.inserted === true) {
      skipped++;
      continue;
    }

    const normalizedJob = normalizeAiJobForDb(job);

    if (!normalizedJob.title || !normalizedJob.description) {
      console.warn("⚠️ Skipping job due to missing title/description");
      skipped++;
      continue;
    }

    const exists = await Job.findOne({ title: normalizedJob.title });
    if (exists) {
      job.inserted = true;
      skipped++;
      continue;
    }

    await Job.create(normalizedJob);

    job.inserted = true;
    inserted++;
  }

  await fs.writeJson(AI_JOBS_FILE, aiJobs, { spaces: 2 });

  return { inserted, skipped };
}
