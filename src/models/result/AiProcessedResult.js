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

    resultType: {
      type: String,
    },
    importantLinks: [{ linkName: String, linkUrl: String }],
    importantDates: [{ linkName: String, linkUrl: String }],
    sourceUrl: String,
    aiProcessedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.models.AiProcessedResult ||
  mongoose.model("AiProcessedResult", AiProcessedResultSchema);
