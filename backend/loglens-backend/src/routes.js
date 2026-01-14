const express = require("express");
const router = express.Router();

/* ---------- Health Check ---------- */
router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "LogLens API" });
});

/* ---------- Auth ---------- */
router.use("/auth", require("./modules/auth/auth.routes"));

/* ---------- Projects ---------- */
router.use("/projects", require("./modules/projects/projects.routes"));

/* ---------- Repos & Webhooks ---------- */
router.use("/repos", require("./modules/repo/repo.routes"));

/* ---------- Logs ---------- */
router.use("/logs", require("./modules/logs/logs.routes"));

/* ---------- Analysis ---------- */
router.use("/analysis", require("./modules/analysis/analysis.routes"));

module.exports = router;
