const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3002;

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

const userRecommendations = {
  milan: [
    {
      id: 2,
      title: "God of War Ragnarök",
      reason: "Based on your action game preferences",
    },
    {
      id: 3,
      title: "Halo Infinite",
      reason: "You enjoy fast-paced shooters",
    },
  ],
  admin: [
    {
      id: 1,
      title: "The Legend of Zelda: Breath of the Wild",
      reason: "Based on your love for open-world games",
    },
    {
      id: 4,
      title: "Elden Ring",
      reason: "You like challenging RPGs",
    },
  ],
};

app.get("/recommendations", authenticateToken, (req, res) => {
  const username = req.user?.username || "default";
  const recommendations = userRecommendations[username] || [];
  res.json({
    username,
    recommendedGames: recommendations,
  });
});

app.post("/recommendations", authenticateToken, (req, res) => {
  const username = req.user?.username || "default";
  const { id, title, reason } = req.body;

  if (!id || !title || !reason) {
    return res.status(400).json({ error: "Missing id, title or reason" });
  }

  if (!userRecommendations[username]) {
    userRecommendations[username] = [];
  }

  userRecommendations[username].push({ id, title, reason });
  res.status(201).json({ message: "Recommendation added", data: userRecommendations[username] });
});

app.listen(port, () => {
  console.log(`Recommendations service running on http://localhost:${port}`);
});
