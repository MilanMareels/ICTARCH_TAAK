const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3007;

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

app.use(express.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.username !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
}

const curatorEntries = [
  { id: 1, gameId: 1, curatedBy: "admin", comment: "Masterpiece in open-world design" },
  { id: 2, gameId: 2, curatedBy: "admin", comment: "Excellent story and combat" },
];

app.get("/curator", authenticateToken, isAdmin, (req, res) => {
  res.json(curatorEntries);
});

app.post("/curator", authenticateToken, (req, res) => {
  const { gameId, comment } = req.body;
  if (!gameId || !comment) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const entry = {
    id: curatorEntries.length + 1,
    gameId,
    curatedBy: req.user.username,
    comment,
  };

  curatorEntries.push(entry);
  res.status(201).json({ message: "Curator suggestion added", entry });
});

app.put("/curator/:id", authenticateToken, isAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const entry = curatorEntries.find((e) => e.id === id);

  if (!entry) return res.status(404).json({ error: "Entry not found" });

  const { gameId, comment } = req.body;
  if (gameId) entry.gameId = gameId;
  if (comment) entry.comment = comment;

  res.json({ message: "Entry updated", entry });
});

app.delete("/curator/:id", authenticateToken, isAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const index = curatorEntries.findIndex((e) => e.id === id);

  if (index === -1) return res.status(404).json({ error: "Entry not found" });

  const deleted = curatorEntries.splice(index, 1);
  res.json({ message: "Entry deleted", deleted });
});

app.listen(port, () => {
  console.log(`Curator Service running on http://localhost:${port}`);
});
