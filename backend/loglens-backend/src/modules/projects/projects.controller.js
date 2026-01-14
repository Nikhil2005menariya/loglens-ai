const Project = require("../../models/Project");
const Repo = require("../../models/Repo");
const repoService = require("../repo/repo.service");
const CodeChunk = require("../../models/CodeChunk");
const LogEvent = require("../../models/LogEvent");
const Analysis = require("../../models/Analysis");

exports.createProject = async (req, res, next) => {
  try {
    const { name, repoUrl } = req.body;

    const project = await Project.create({
      userId: req.user.id,
      name,
      repoUrl
    });

    const repo = await repoService.ingestRepo({
      repoUrl,
      userId: req.user.id
    });

    project.repoId = repo._id;
    await project.save();

    res.json({
      data: project,
      meta: {
        webhook: `/api/repos/webhook/github`
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // 1️⃣ Find project (ownership check)
    const project = await Project.findOne({
      _id: projectId,
      userId,
    });

    if (!project) {
      return res.status(404).json({
        error: { message: "Project not found" },
      });
    }

    // 2️⃣ Delete repo + memory
    await Repo.deleteOne({ _id: project.repoId });
    await CodeChunk.deleteMany({ repoId: project.repoId });

    // 3️⃣ Delete logs + analyses
    await LogEvent.deleteMany({ projectId });
    await Analysis.deleteMany({ projectId });

    // 4️⃣ Delete project
    await Project.deleteOne({ _id: projectId });

    res.json({
      data: { success: true },
    });
  } catch (err) {
    console.error("❌ deleteProject failed:", err);
    res.status(500).json({
      error: { message: "Failed to delete project" },
    });
  }
};
