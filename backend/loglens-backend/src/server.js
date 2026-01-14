require("dotenv").config();
const genAI = require("./utils/gemini");
global.genAI = genAI;
const app = require("./app");
const { PORT } = require("./config/env");

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION ❌");
  console.error(err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION ❌");
  console.error(err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`🚀 LogLens backend running on port ${PORT}`);
});
