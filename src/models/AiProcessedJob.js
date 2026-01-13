import mongoose from "mongoose";

const AiProcessedJobSchema = new mongoose.Schema(
  {
    sourceUrl: {
      type: String,
      required: true,
      unique: true, // 🔐 one AI result per job
    },

    title: String,
    description: String,

    location: {
      city: String,
      state: String,
    },

    importantDates: {
      applicationDeadline: String,
      lastDateToPayFees: String,
      examDate: String,
      admitCardsDate: String,
    },

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

    applicationFees: {
      General: String,
      OBC: String,
      SC_ST: String,
    },

    ageLimit: {
      lowerLimit: {
        General: String,
        OBC: String,
        SC_ST: String,
      },
      upperLimit: {
        General: String,
        OBC: String,
        SC_ST: String,
      },
    },

    totalPost: Number,

    postClassification: [
      {
        postName: String,
        numberOfPosts: Number,
        eligibilityCriteria: [String],
      },
    ],

    fillingProcedure: [String],

    // 🔑 pipeline control
    aiProcessedAt: Date,
    ingested: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AiProcessedJob ||
  mongoose.model("AiProcessedJob", AiProcessedJobSchema);
