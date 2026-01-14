const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const routes = require("./routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// --------------------
// Database connection
// --------------------
connectDB();

// --------------------
// Global middlewares
// --------------------
app.use(cors());
app.use(morgan("dev"));

/**
 * IMPORTANT:
 * We must keep access to the raw request body
 * for GitHub webhook signature verification.
 */
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);

// --------------------
// Routes
// --------------------
app.use("/api", routes);

// --------------------
// Error handler (LAST)
// --------------------
app.use(errorHandler);

module.exports = app;
