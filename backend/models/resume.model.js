import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    resumeData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    templateType: {
      type: String,
      enum: ["ui", "latex"],
      default: "ui",
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    pdfPublicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);
