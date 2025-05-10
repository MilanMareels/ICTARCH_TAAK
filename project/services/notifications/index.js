const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3003;

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

app.use(express.json());

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

const notifications = {
  milan: [
    { id: 1, message: "New update available for Elden Ring!" },
    { id: 2, message: "You earned a new badge in God of War!" },
  ],
  admin: [
    { id: 1, message: "Admin dashboard has been updated." },
    { id: 2, message: "New users registered today: 5" },
  ],
};

app.get("/notifications", authenticateToken, (req, res) => {
  const username = req.user?.username || "default";
  const userNotifications = notifications[username] || [{ id: 0, message: "Welcome to the notification system!" }];

  res.json({
    username,
    notifications: userNotifications,
  });
});

app.post("/notifications", authenticateToken, (req, res) => {
  const username = req.user?.username;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  if (!notifications[username]) {
    notifications[username] = [];
  }

  const newNotification = {
    id: notifications[username].length + 1,
    message,
  };

  notifications[username].push(newNotification);
  res.status(201).json(newNotification);
});

app.listen(port, () => {
  console.log(`Notification Service running on http://localhost:${port}`);
});
