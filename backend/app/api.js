const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("../storage/db");

/* constants */
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:2000";

const app = express();

// Configure CORS options
const corsOptions = {
  origin: [FRONTEND_URL, process.env.VITE_SOCKET_URL, "http://localhost:3000"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

/* Serve static files from the 'frontend' directory */
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.post("/score", async (req, res) => {
  const { username, score } = req.body;
  if (!username || !score) {
    return res.status(400).json({ error: "Invalid request" });
  }
  try {
    await db.saveScore(username, score);
    res.status(200).json({ message: "Score saved successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ error: "Could not save" });
  }
});

app.get("/scores", async (req, res) => {
  try {
    const scores = await db.getAllScores();
    res.status(200).json(scores);
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ error: "Does not exist" });
  }
});

module.exports = app;
