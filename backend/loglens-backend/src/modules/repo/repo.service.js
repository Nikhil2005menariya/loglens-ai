const path = require("path");
const fs = require("fs");
const simpleGit = require("simple-git");

const Repo = require("../../models/Repo");
const CodeChunk = require("../../models/CodeChunk");

// IMPORTANT:
// repos directory is OUTSIDE backend folder
// loglens/
// ├── loglens-backend/
// └── repos/
const REPO_BASE_PATH = path.join(process.cwd(), "..", "repos");

// Allowed source files to index
const ALLOWED_EXTENSIONS = [
  ".js",
  ".ts",
  ".jsx",
  ".tsx",
  ".json",
  ".md",
  ".yml",
  ".yaml"
];

exports.ingestRepo = async ({ repoUrl, userId }) => {
  try {
    // -----------------------------
    // 1. Parse GitHub repo URL
    // -----------------------------
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      throw new Error("Invalid GitHub repository URL");
    }

    const owner = match[1];
    const name = match[2].replace(".git", "");

    // -----------------------------
    // 2. Prevent duplicate repos
    // -----------------------------
    const existing = await Repo.findOne({ userId, owner, name });
    if (existing) {
      return existing;
    }

    // -----------------------------
    // 3. Prepare filesystem path
    // -----------------------------
    if (!fs.existsSync(REPO_BASE_PATH)) {
      fs.mkdirSync(REPO_BASE_PATH, { recursive: true });
    }

    const repoPath = path.join(REPO_BASE_PATH, `${userId}_${name}`);

    // -----------------------------
    // 4. Clone repository
    // -----------------------------
    await simpleGit().clone(repoUrl, repoPath);
    const git = simpleGit(repoPath);

    // -----------------------------
    // 5. Detect default branch
    // -----------------------------
    const branchInfo = await git.branch();
    const defaultBranch = branchInfo.current || "main";

    // -----------------------------
    // 6. Get latest commit hash
    // -----------------------------
    const log = await git.log({ maxCount: 1 });
    const lastIndexedCommit = log.latest.hash;

    // -----------------------------
    // 7. Create Repo document
    // -----------------------------
    const repo = await Repo.create({
      userId,
      owner,
      name,
      repoUrl,
      defaultBranch,
      lastIndexedCommit
    });

    // -----------------------------
    // 8. Index repository files
    // -----------------------------
    const trackedFiles = await git.raw(["ls-files"]);
    const fileList = trackedFiles.split("\n").filter(Boolean);

    for (const filePath of fileList) {
      if (!ALLOWED_EXTENSIONS.some(ext => filePath.endsWith(ext))) {
        continue;
      }

      const fullPath = path.join(repoPath, filePath);
      if (!fs.existsSync(fullPath)) continue;

      const content = fs.readFileSync(fullPath, "utf-8");
      if (!content || content.length < 20) continue;

      await CodeChunk.create({
        repoId: repo._id,
        filePath,
        content,
        commitHash: lastIndexedCommit
      });
    }

    return repo;
  } catch (err) {
    console.error("❌ Repo ingestion failed");
    throw err;
  }
};
