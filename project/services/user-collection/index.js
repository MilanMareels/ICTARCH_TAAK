const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3008;

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

const userCollections = {
  milan: [
    { gameId: 1, title: "Zelda: Tears of the Kingdom" },
    { gameId: 2, title: "God of War Ragnarök" },
  ],
  admin: [{ gameId: 3, title: "Halo Infinite" }],
};

app.get("/collection", authenticateToken, (req, res) => {
  const username = req.user?.username;
  const collection = userCollections[username] || [];
  res.json({ username, collection });
});

app.post("/collection", authenticateToken, (req, res) => {
  const username = req.user?.username;
  const { gameId, title } = req.body;

  if (!gameId || !title) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (!userCollections[username]) {
    userCollections[username] = [];
  }

  const exists = userCollections[username].some((game) => game.gameId === gameId);
  if (exists) {
    return res.status(409).json({ error: "Game already in collection" });
  }

  const game = { gameId, title };
  userCollections[username].push(game);
  res.status(201).json({ message: "Game added to collection", game });
});

app.delete("/collection/:gameId", authenticateToken, (req, res) => {
  const username = req.user?.username;
  const gameId = parseInt(req.params.gameId);

  if (!userCollections[username]) {
    return res.status(404).json({ error: "User has no collection" });
  }

  const index = userCollections[username].findIndex((g) => g.gameId === gameId);
  if (index === -1) {
    return res.status(404).json({ error: "Game not found in collection" });
  }

  const removed = userCollections[username].splice(index, 1);
  res.json({ message: "Game removed from collection", removed });
});

app.listen(port, () => {
  console.log(`User Collection Service running on http://localhost:${port}`);
});
