import mongoose from "mongoose";

const AiProcessedAdmitCardSchema = new mongoose.Schema(
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

    importantLinks: {
      downloadAdmitCard: String,
      officialWebsite: String,
      downloadAdmidCardNotice: String,
      checkExamCity: String,
      downloadSyllabus: String,
      downloadNotification: String,
      downloadAnswerKey: String,
      downloadExamNotice: String,
      downloadInterviewLetter: String,
      downloadPreResult: String,
      downloadMainsNotice: String,
    },

    otherLinks: [
      {
        linkName: String,
        linkUrl: String,
      },
    ],

    importantDates: {
      applicationDeadline: String,
      lastDateToPayFees: String,
      examDate: String,
      admitCardsDate: String,
    },

    otherDates: [
      {
        linkName: String,
        linkUrl: String,
      },
    ],

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

     applicationFees: {
      General: String,
      OBC: String,
      SC_ST: String,
    },

    totalPost: Number,
  },
  { timestamps: true },
);

export default mongoose.models.AiProcessedAdmitCard ||
  mongoose.model("AiProcessedAdmitCard", AiProcessedAdmitCardSchema);
