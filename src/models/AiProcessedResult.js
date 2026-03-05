import mongoose, { Schema } from "mongoose";

const AiProcessedResultSchema = new Schema({
    examName : {
        type: String,
        required: true,
    },
    resultDate : {
        type: String,
    },
    importantLinks: {
        resultLink: String,
        officialWebsite: String,
    },
    resultType : {
        type: String,
    }
}, { timestamps: true });

export default mongoose.models.AiProcessedResult ||
  mongoose.model("AiProcessedResult", AiProcessedResultSchema);
