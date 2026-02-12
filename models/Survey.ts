import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "متن سؤال الزامی است"],
    },
    type: {
      type: String,
      enum: ["text", "single", "multi", "multi_with_text"],
      required: true,
    },
    options: {
      type: [String],
      default: [],
    },
    descriptiveQuestion: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
  }
);

const surveySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام نظرسنجی الزامی است"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    endDate: {
      type: Date,
      required: [true, "تاریخ پایان الزامی است"],
    },
    questions: [questionSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property for checking active status
surveySchema.virtual("isActive").get(function () {
  const now = new Date();

  const endOfDay = new Date(this.endDate);
  endOfDay.setHours(23, 59, 59, 999);

  return now <= endOfDay;
});

// Middleware for save
surveySchema.post("save", async function () {
  for (const question of this.questions) {
    if (question.type === "multi_with_text") {
      if (!question.descriptiveQuestion) {
        question.descriptiveQuestion = "لطفا توضیح دهید:";
      }
      if (!question.options || question.options.length === 0) {
        question.options = ["گزینه 1", "گزینه 2"];
      }
      question.options = question.options.filter(
        (opt) => opt && opt.trim() !== ""
      );
    }
  }
});

export default mongoose.models.Survey || mongoose.model("Survey", surveySchema);
