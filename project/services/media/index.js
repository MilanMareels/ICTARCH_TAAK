const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3006;

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

const media = [
  { gameId: 1, type: "image", url: "https://insider-gaming.com/wp-content/uploads/2023/03/Legend-of-Zelda-Tears-of-the-Kingdom-Direct-1.jpg" },
  { gameId: 1, type: "trailer", url: "https://youtu.be/uHGShqcAHlQ" },
  {
    gameId: 2,
    type: "image",
    url: "https://th.bing.com/th/id/R.901287d9b78029a093d38dfa9b41268b?rik=bTvbQtnc%2fgxa3w&riu=http%3a%2f%2fconceptartworld.com%2fwp-content%2fuploads%2f2018%2f04%2fThe-Art-of-God-of-War-Cover-01.jpg&ehk=Q4T7cWh5bUjoYS7UzHtn635cKilPlImyMFYLHpaAQJY%3d&risl=&pid=ImgRaw&r=0",
  },
];

app.get("/media", authenticateToken, (req, res) => {
  res.json(media);
});

app.post("/media", authenticateToken, (req, res) => {
  const { gameId, type, url } = req.body;
  if (!gameId || !type || !url) {
    return res.status(400).json({ error: "Missing fields" });
  }

  media.push({ gameId, type, url });
  res.status(201).json({ message: "Media added", media });
});

app.listen(port, () => {
  console.log(`Media Service running on http://localhost:${port}`);
});
