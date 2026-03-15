import mongoose from "mongoose";

const ScrapedAdmitCardMetaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
    },
    source: {
      type: String,
      default: "rojgarresult",
    },
    firstSeenAt: {
      type: Date,
      default: Date.now,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ScrapedAdmitCardMetaSchema ||
  mongoose.model("ScrapedAdmitCardMeta", ScrapedAdmitCardMetaSchema);