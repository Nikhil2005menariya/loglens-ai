const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const simpleGit = require("simple-git");
const glob = require("glob");

const Repo = require("../../models/Repo");
const CodeChunk = require("../../models/CodeChunk");

const REPO_BASE_PATH = path.join(
  process.cwd(),
  "..",
  "repos"
);


const ALLOWED_EXTENSIONS = [
  ".js", ".ts", ".jsx", ".tsx",
  ".json", ".md",
  ".env", ".yml", ".yaml"
];

// 🔐 Verify GitHub signature
function verifySignature(req) {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature || !req.rawBody) {
    return false;
  }

  const hmac = crypto.createHmac(
    "sha256",
    process.env.GITHUB_WEBHOOK_SECRET
  );

  const digest = `sha256=${hmac
    .update(req.rawBody)   // ✅ CORRECT
    .digest("hex")}`;

  return signature === digest;
}


exports.handleGithubWebhook = async (req, res) => {
  try {
    if (!verifySignature(req)) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }

    const payload = req.body;
    const repoName = payload.repository.name;
    const owner = payload.repository.owner.login;
    const commitHash = payload.after;

    const repo = await Repo.findOne({ name: repoName, owner });
    if (!repo) {
      return res.status(200).json({ message: "Repo not tracked" });
    }

    const repoPath = path.join(REPO_BASE_PATH, repo._id.toString());

// ✅ Ensure repo directory exists
if (!fs.existsSync(repoPath)) {
  console.log("📥 Repo folder missing. Re-cloning repository...");

  await simpleGit().clone(
    `https://github.com/${owner}/${repoName}.git`,
    repoPath
  );

  console.log("✅ Repo cloned successfully for webhook processing");
}

const git = simpleGit(repoPath);


    console.log(`🔄 Updating repo memory for ${owner}/${repoName}`);

    // Pull latest code
    await git.pull();

    // Get changed files
    const diff = await git.diff([
      `${repo.lastIndexedCommit}`,
      commitHash,
      "--name-only"
    ]);

    const changedFiles = diff
      .split("\n")
      .filter(f =>
        ALLOWED_EXTENSIONS.some(ext => f.endsWith(ext))
      );

    console.log("📂 Changed files:", changedFiles);

    // Remove old memory
    await CodeChunk.deleteMany({
      repoId: repo._id,
      filePath: { $in: changedFiles }
    });

    // Re-index only changed files
    for (const file of changedFiles) {
      const fullPath = path.join(repoPath, file);
      if (!fs.existsSync(fullPath)) continue;

      try {
        const content = fs.readFileSync(fullPath, "utf-8");
        if (!content || content.length < 20) continue;

        await CodeChunk.create({
          repoId: repo._id,
          filePath: file,
          content,
          commitHash
        });
      } catch (err) {
        console.warn(`Skipped file during reindex: ${file}`);
      }
    }

    repo.lastIndexedCommit = commitHash;
    await repo.save();

    console.log("✅ Repo memory updated successfully");

    res.status(200).json({ message: "Repo memory updated" });
  } catch (err) {
    console.error("❌ Webhook processing failed", err);
    res.status(500).json({ error: "Webhook failed" });
  }
};
