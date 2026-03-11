import mongoose, { Schema } from "mongoose";

const AiProcessedResultSchema = new Schema(
  {
    title: String,
    description: String,
    examName: {
      type: String,
      required: true,
    },
    resultDate: {
      type: String,
    },

    location: {
      city: String,
      state: String,
    },

    resultType: {
      type: String,
    },
    importantDates: {
      resultDate: String,
      applicationDeadline: String,
      lastDateToPayFees: String,
      examDate: String,
      admitCardsDate: String,
    },
    importantLinks : {
      downloadResult: String,
      officialNotification: String,
      officialWebsite: String,
    },

    otherLinks: [{ linkName: String, linkUrl: String }],
    otherDates: [{ linkName: String, linkUrl: String }],
    sourceUrl: String,
    aiProcessedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.models.AiProcessedResult ||
  mongoose.model("AiProcessedResult", AiProcessedResultSchema);
