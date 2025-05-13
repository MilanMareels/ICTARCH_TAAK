const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3000;

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

const games = [
  {
    id: 1,
    title: "The Legend of Zelda: Breath of the Wild",
    genre: "Adventure",
    platform: "Nintendo Switch",
    releaseYear: 2017,
  },
  {
    id: 2,
    title: "God of War Ragnarök",
    genre: "Action",
    platform: "PlayStation 5",
    releaseYear: 2022,
  },
  {
    id: 3,
    title: "Halo Infinite",
    genre: "Shooter",
    platform: "Xbox Series X",
    releaseYear: 2021,
  },
  {
    id: 4,
    title: "Elden Ring",
    genre: "RPG",
    platform: "PC",
    releaseYear: 2022,
  },
];

app.get("/game-catalog", authenticateToken, (req, res) => {
  res.json(games);
});

app.post("/game-catalog", authenticateToken, (req, res) => {
  const game = req.body;
  if (!game.title || !game.genre || !game.platform || !game.releaseYear) {
    return res.status(400).json({ error: "Missing game properties" });
  }

  game.id = games.length + 1;
  games.push(game);
  res.status(201).json(game);
});

app.listen(port, () => {
  console.log(`Game Catalog Service running on http://localhost:${port}`);
});
