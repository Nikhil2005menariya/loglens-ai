function extractJSON(text) {
  if (!text) return null;

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch (err) {
    console.error("❌ Failed to parse AI JSON:", err);
    return null;
  }
}

module.exports = {
  extractJSON,
};
