const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true
    },

    repoUrl: {
      type: String,
      required: true
    },

    repoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repo"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
