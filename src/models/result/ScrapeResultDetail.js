import mongoose from "mongoose";

const ScrapedResultDetailSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },

    title: String,

    rawContent: {
      type: Array, // [{ tag, text, links }]
      required: true,
    },

    isProcessed: {
      type: Boolean,
      default: false,
      index: true,
    },

    aiProcessedAt: Date,
    aiFailedAt: Date,
    aiError: String,

    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ScrapedResultDetail ||
  mongoose.model("ScrapedResultDetail", ScrapedResultDetailSchema);