import mongoose from "mongoose";

const ScrapedJobDetailSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      index: true,
    },
    rawContent: {
      type: Object, // store cheerio-parsed data
      required: true,
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ScrapedJobDetail ||
  mongoose.model("ScrapedJobDetail", ScrapedJobDetailSchema);
