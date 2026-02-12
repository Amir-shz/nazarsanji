import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Survey",
      required: true,
    },
    userNationalCode: {
      type: String,
      required: true,
    },
    userFullName: {
      type: String,
      required: true,
    },
    userServiceLocation: {
      type: String,
      required: true,
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        answer: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure one answer per user per survey
answerSchema.index({ surveyId: 1, userNationalCode: 1 }, { unique: true });

export default mongoose.models.Answer || mongoose.model("Answer", answerSchema);
