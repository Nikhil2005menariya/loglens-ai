const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const Repo = require("../../models/Repo");

// 🔓 GitHub webhook MUST remain public
router.post("/webhook/github", require("./webhook.controller").handleGithubWebhook);

// 🔒 All routes below require auth
router.use(auth);

/**
 * GET /api/repos
 * List repos owned by the logged-in user
 */
router.get("/", async (req, res, next) => {
  try {
    const repos = await Repo.find({ userId: req.user.id }).sort({
      updatedAt: -1
    });

    res.json({
      data: repos.map((repo) => ({
        id: repo._id,
        name: repo.name,
        owner: repo.owner,
        repoUrl: repo.repoUrl,
        lastIndexedCommit: repo.lastIndexedCommit,
        updatedAt: repo.updatedAt
      })),
      meta: { total: repos.length }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
