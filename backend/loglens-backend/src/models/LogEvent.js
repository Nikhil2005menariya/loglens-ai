const mongoose = require("mongoose");

const logEventSchema = new mongoose.Schema(
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

    rawLogs: {
      type: String,
      required: true,
    },

    environment: {
      type: String,
      default: "local",
    },

    severity: {
      type: String,
      default: "error",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LogEvent", logEventSchema);
