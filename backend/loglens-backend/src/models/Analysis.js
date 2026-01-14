const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    repoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repo",
      required: true,
      index: true,
    },

    logEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LogEvent",
      required: true,
      unique: true,
    },

    parsedLog: {
      errorType: String,
      message: String,
      files: Array,
      severity: String,
    },

    matchedFiles: [
      {
        filePath: String,
        snippet: String,
      },
    ],

    aiAnalysis: {
      rootCause: { type: String, required: true },
      explanation: String,

      /** 🔥 REQUIRED FOR UI */
      fix: { type: String, required: true },

      /** 🔥 OPTIONAL – future auto-PR */
      diff: {
        file: String,
        before: String,
        after: String,
      },

      checklist: [String],

      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5,
      },

      validation: {
        status: {
          type: String,
          enum: ["verified", "partial", "conceptual"],
          default: "conceptual",
        },
        reason: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);
