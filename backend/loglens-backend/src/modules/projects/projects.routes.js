const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const controller = require("./projects.controller");

// 🔐 protect all project routes
router.use(auth);

// POST /api/projects
router.post("/", controller.createProject);

// GET /api/projects
router.get("/", async (req, res, next) => {
  try {
    const Project = require("../../models/Project");

    const projects = await Project.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      data: projects.map(p => ({
        id: p._id,
        name: p.name,
        repoId: p.repoId,
        createdAt: p.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:projectId", auth, controller.deleteProject);


module.exports = router;
