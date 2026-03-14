import mongoose, { Schema } from "mongoose";

const AiProcessedResultSchema = new Schema(
  {
    title: String,
    description: String,

    examName: {
      type: String,
      required: true,
    },

    resultDate: String,

    location: {
      city: String,
      state: String,
    },

    resultType: String,

    /* IMPORTANT DATES (ARRAY) */

    importantDates: [
      {
        examDate: String,
        resultDate: String,
        admitCardsDate: String,
        applicationDeadline: String,
        lastDateToPayFees: String,
      }
    ],

    /* IMPORTANT LINKS (ARRAY) */

    importantLinks: [
      {
        downloadResult : {
        type : String,
      },

      downloadNotification : {
        type : String,
      },
      officialWebsite : {
        type : String,
      },
      downloadAdmitCard : {
        type : String,
      },
      downloadExamNotice : {
        type : String,
      },
      downloadInterviewLetter : {
        type : String,
      },
      downloadAnswerKey : {
        type : String,
      },
      downloadPreResult : {
        type : String,
      },
      downloadMainResult : {
        type : String,
      },

      downloadMeritList : {
        type : String,
      }
    
    }

    ],

    /* OTHER LINKS */

    otherLinks: [
      {
        linkName: String,
        linkUrl: String,
      },
    ],

    /* OTHER DATES */

    otherDates: [
      {
        linkName: String,
        linkUrl: String,
      },
    ],

    sourceUrl: String,

    aiProcessedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.AiProcessedResult ||
  mongoose.model("AiProcessedResult", AiProcessedResultSchema);