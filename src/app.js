
require("dotenv").config();

const express = require("express");
const pool = require("./config/database");
const surveyResponseRoutes = require("./routes/surveyResponseRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Smart CRM API is running" });
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "disconnected"
    });
  }
});

app.use("/api/survey-responses", surveyResponseRoutes);

module.exports = app;
