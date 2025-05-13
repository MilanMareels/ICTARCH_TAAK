const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3004;

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware om JWT-token te controleren
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

const users = {
  milan: {
    id: 1,
    username: "milan",
    email: "milan@example.com",
    favoriteGenre: "RPG",
  },
  admin: {
    id: 2,
    username: "admin",
    email: "admin@example.com",
    favoriteGenre: "Strategy",
  },
};

app.get("/users/me", authenticateToken, (req, res) => {
  const username = req.user?.username;
  const userInfo = users[username];

  if (!userInfo) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(userInfo);
});

app.listen(port, () => {
  console.log(`User Service running on http://localhost:${port}`);
});
