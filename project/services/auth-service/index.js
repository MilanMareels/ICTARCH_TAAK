const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
const port = 4000;

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const dummyUser = { id: 1, username: "admin" };

app.post("/login", (req, res) => {
  const { username } = req.body;
  if (username === dummyUser.username) {
    const token = jwt.sign({ id: dummyUser.id, username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.listen(port, () => {
  console.log(`Auth Service running on port http://localhost:${port}`);
});
