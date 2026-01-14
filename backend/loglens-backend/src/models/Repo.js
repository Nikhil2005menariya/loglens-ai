const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    owner: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    repoUrl: {
      type: String,
      required: true
    },

    defaultBranch: {
      type: String,
      default: "main"
    },

    lastIndexedCommit: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

repoSchema.index({ userId: 1, owner: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Repo", repoSchema);
