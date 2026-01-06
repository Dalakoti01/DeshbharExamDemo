import mongoose, { Schema } from "mongoose";



const jobSchema = new Schema(
  {
    /* ---------- Basic Info ---------- */
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    /* ---------- Location ---------- */
    location: {
      city: { type: String },
      state: { type: String },
    },

    /* ---------- Important Dates ---------- */
    importantDates: {
      publishedDate: {
        type: Date,
        default: Date.now,
      },
      applicationDeadline: Date,
      lastDateToPayFees: Date,
      examDate: Date,
      admitCardsDate: Date,
    },

    /* ---------- Links ---------- */
    importantLinks: {
      applyOnline: String,
      officialNotification: String,
      officialWebsite: String,
    },

    otherLinks: [
      {
        linkName: String,
        linkUrl: String,
      },
    ],

    /* ---------- Fees ---------- */
    applicationFees: {
      General: String,
      OBC: String,
      SC_ST: String,
    },

    /* ---------- Age Limit (FIXED) ---------- */
    ageLimit: {
      lowerLimit: {
        General: {type : String},
        OBC: {type : String},
        SC_ST: {type : String},
      },
      upperLimit: {
        General: {type : String},
        OBC: {type : String},
        SC_ST: {type : String},
      },
    },

    /* ---------- Posts ---------- */
    totalPost: Number,

    postClassification: [
      {
        postName: String,
        numberOfPosts: Number,
        eligibilityCriteria: [String],
      },
    ],

    /* ---------- Application Procedure ---------- */
    fillingProcedure: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", jobSchema);
