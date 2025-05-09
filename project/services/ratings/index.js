const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3001;

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware om token te controleren
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

app.get("/ratings", authenticateToken, (req, res) => {
  res.json([
    {
      gameId: 1,
      averageRating: 4.9,
      ratingsCount: 12842,
    },
    {
      gameId: 2,
      averageRating: 4.8,
      ratingsCount: 9342,
    },
    {
      gameId: 3,
      averageRating: 4.4,
      ratingsCount: 7540,
    },
    {
      gameId: 4,
      averageRating: 4.7,
      ratingsCount: 10211,
    },
  ]);
});

app.listen(port, () => {
  console.log(`Rating Service running on http://localhost:${port}`);
});
