const mongoose = require("mongoose");

const codeChunkSchema = new mongoose.Schema(
  {
    repoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repo",
      required: true,
      index: true
    },

    filePath: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true
    },

    commitHash: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CodeChunk", codeChunkSchema);
