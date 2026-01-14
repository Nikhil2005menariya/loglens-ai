const { runAnalysis } = require("./analysis.service");

const service = require("./analysis.service"); // ✅ ADD THIS LINE
exports.runAnalysis = async (req, res) => {
  try {
    const { logEventId } = req.body;

    if (!logEventId) {
      return res.status(400).json({
        error: "logEventId is required",
      });
    }

    const analysis = await runAnalysis({ logEventId });

    return res.status(200).json({
      data: analysis,
    });
  } catch (err) {
    console.error("❌ runAnalysis failed:", err);
    return res.status(500).json({
      error: err.message || "Analysis failed",
    });
  }
};
exports.getHistory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const result = await service.getHistory({
      projectId,
      page,
      limit
    });

    res.status(200).json({ data: result });
  } catch (err) {
    console.error("❌ getHistory failed:", err);
    res.status(500).json({ error: err.message });
  }
};


