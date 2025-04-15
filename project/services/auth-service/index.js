const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
const SECRET = "mysecret";

app.post("/login", (req, res) => {
  const token = jwt.sign({ user: "demo" }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.get("/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    jwt.verify(token, SECRET);
    res.sendStatus(200);
  } catch {
    res.sendStatus(401);
  }
});

app.get("/metrics", (req, res) => res.send("# HELP auth_metric 1\nauth_metric 1"));

app.listen(3000, () => console.log("Auth-service listening on port 3000"));
