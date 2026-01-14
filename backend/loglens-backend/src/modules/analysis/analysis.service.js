const path = require("path");

const LogEvent = require("../../models/LogEvent");
const Analysis = require("../../models/Analysis");
const CodeChunk = require("../../models/CodeChunk");

const { parseLog } = require("../../utils/logParser");
const { buildDebugPrompt } = require("../../utils/aiPrompt");
const { extractJSON } = require("../../utils/dto");
const { validateFix } = require("../../utils/fixValidator");

exports.runAnalysis = async ({ logEventId }) => {
  // 1️⃣ Load log event
  const logEvent = await LogEvent.findById(logEventId);
  if (!logEvent) {
    throw new Error("LogEvent not found");
  }

  // 2️⃣ Prevent duplicate analysis
  const existing = await Analysis.findOne({ logEventId });
  if (existing) return existing;

  // 3️⃣ Parse raw logs
  const parsedLog = parseLog(logEvent.rawLogs);

  // 4️⃣ Find relevant files from stack trace
  const filenames = parsedLog.files.map(f =>
    path.basename(f.filePath)
  );

  const matchedChunks = filenames.length
    ? await CodeChunk.find({
        repoId: logEvent.repoId,
        filePath: { $regex: `(${filenames.join("|")})$` }
      }).limit(5)
    : [];

  // 5️⃣ Build LLM prompt
  const prompt = buildDebugPrompt({
    parsedLog,
    matchedFiles: matchedChunks.map(c => ({
      filePath: c.filePath,
      snippet: c.content.slice(0, 1000),
    })),
  });

  // 6️⃣ Call Gemini
  const model = global.genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  // 7️⃣ Parse Gemini JSON
  const aiRaw = extractJSON(rawText);
  if (!aiRaw) {
    throw new Error("Failed to extract JSON from Gemini response");
  }

  // 8️⃣ Validate fix against repo context
  const validation = validateFix({
    diff: aiRaw.diff,
    matchedChunks,
  });

  // 9️⃣ NORMALIZE AI OUTPUT (🔥 critical fix)
  const aiAnalysis = {
    rootCause:
      aiRaw.rootCause ??
      "Root cause could not be confidently determined.",

    explanation: aiRaw.explanation ?? "",

    // 🔥 THIS FIXES YOUR UI ISSUE
    fix:
      typeof aiRaw.fix === "string" && aiRaw.fix.trim()
        ? aiRaw.fix
        : aiRaw.diff?.after
        ? `Apply the following change:\n\n${aiRaw.diff.after}`
        : "Inspect the referenced file and line number. The issue likely occurs near the reported stack trace.",

    diff: aiRaw.diff ?? null,

    checklist: Array.isArray(aiRaw.checklist)
      ? aiRaw.checklist
      : [],

    confidence:
      typeof aiRaw.confidence === "number"
        ? Math.min(Math.max(aiRaw.confidence, 0), 1)
        : 0.5,

    validation,
  };

  // 🔟 Persist analysis
  const analysis = await Analysis.create({
    projectId: logEvent.projectId,
    repoId: logEvent.repoId,
    logEventId,
    parsedLog,
    matchedFiles: matchedChunks.map(c => ({
      filePath: c.filePath,
      snippet: c.content.slice(0, 500),
    })),
    aiAnalysis,
  });

  return analysis;
};

exports.getHistory = async ({ projectId, page, limit }) => {
  const skip = (page - 1) * limit;

  return Analysis.find({ projectId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
