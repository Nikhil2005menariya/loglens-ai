exports.validateFix = ({ diff, matchedChunks }) => {
  if (!diff?.file || !diff?.before || !diff?.after) {
    return {
      status: "conceptual",
      reason: "Missing diff structure"
    };
  }

  const fileChunk = matchedChunks.find(c =>
    c.filePath.endsWith(diff.file)
  );

  if (!fileChunk) {
    return {
      status: "conceptual",
      reason: "Referenced file not found in repo"
    };
  }

  if (!fileChunk.content.includes(diff.before.trim())) {
    return {
      status: "partial",
      reason: "Before-code not found exactly in file"
    };
  }

  return {
    status: "verified",
    reason: "Exact file + code match confirmed"
  };
};
