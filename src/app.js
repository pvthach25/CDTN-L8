
require("dotenv").config();

const express = require("express");
const pool = require("./config/database");
const requireAuth = require("./middlewares/requireAuth");

const app = express();

app.use(express.json({ limit: "32kb" }));

app.get("/", (req, res) => {
  res.json({ message: "Smart CRM API is running" });
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({
      status: "error",
      database: "disconnected"
    });
  }
});

app.use("/api/auth", require("./routes/authRoutes"));

app.use(
  "/api/survey-responses",
  requireAuth,
  require("./routes/surveyResponseRoutes")
);

app.use(
  "/api/tickets",
  requireAuth,
  require("./routes/ticketRoutes")
);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Loi may chu" });
});

module.exports = app;
