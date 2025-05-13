const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
const port = 4000;

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const users = [
  { id: 1, username: "admin", password: "admin123" },
  { id: 2, username: "milan", password: "ww123" },
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.listen(port, () => {
  console.log(`Auth Service running on port http://localhost:${port}`);
});
