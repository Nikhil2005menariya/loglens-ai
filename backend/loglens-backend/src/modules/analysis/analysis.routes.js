const router = require("express").Router();
const controller = require("./analysis.controller");
const auth = require("../../middlewares/auth.middleware");

// Run analysis
router.post("/run", auth, controller.runAnalysis);

// 🔁 Restore history route (USED BY FRONTEND)
router.get("/repo/:projectId", auth, controller.getHistory);

module.exports = router;
