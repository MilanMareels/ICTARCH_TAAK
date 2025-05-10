const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3005;

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

const prices = [
  { gameId: 1, store: "Steam", price: 49.99, currency: "EUR" },
  { gameId: 1, store: "Epic Games", price: 44.99, currency: "EUR" },
  { gameId: 2, store: "PlayStation Store", price: 69.99, currency: "EUR" },
];

app.get("/prices", authenticateToken, (req, res) => {
  res.json(prices);
});

app.post("/prices", authenticateToken, (req, res) => {
  const { gameId, store, price, currency } = req.body;
  if (!gameId || !store || !price || !currency) {
    return res.status(400).json({ error: "Missing fields" });
  }

  prices.push({ gameId, store, price, currency });
  res.status(201).json({ message: "Price added", prices });
});

app.listen(port, () => {
  console.log(`Price Tracking Service running on http://localhost:${port}`);
});
