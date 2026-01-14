const repoService = require("./repo.service");

exports.connectRepo = async (req, res, next) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: "repoUrl is required" });
    }

    const repo = await repoService.ingestRepo({
      repoUrl,
      userId: req.user?._id || null
    });

    res.json({
      message: "Repository indexed successfully",
      repoId: repo._id
    });
  } catch (err) {
    next(err);
  }
};
