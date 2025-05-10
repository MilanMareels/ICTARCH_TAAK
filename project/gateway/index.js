const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();
const port = 5000;

app.use("/login", createProxyMiddleware({ target: "http://auth-service:80/login", changeOrigin: true }));
app.use("/game-catalog", createProxyMiddleware({ target: "http://game-catalog-service:80/game-catalog", changeOrigin: true }));
app.use("/ratings", createProxyMiddleware({ target: "http://rating-service:80/ratings", changeOrigin: true }));
app.use("/recommendations", createProxyMiddleware({ target: "http://recommendations-service:80/recommendations", changeOrigin: true }));
app.use("/notifications", createProxyMiddleware({ target: "http://notifications-service:80/notifications", changeOrigin: true }));
app.use("/users/me", createProxyMiddleware({ target: "http://users-service:80/users/me", changeOrigin: true }));
app.use("/collection", createProxyMiddleware({ target: "http://user-collection-service:80/collection", changeOrigin: true }));

app.use("/curator", createProxyMiddleware({ target: "http://curator-service:80/curator", changeOrigin: true }));
app.use("/media", createProxyMiddleware({ target: "http://media-service:80/media", changeOrigin: true }));
app.use("/prices", createProxyMiddleware({ target: "http://price-tracking-service:80/prices", changeOrigin: true }));

app.listen(port, () => {
  console.log(`API Gateway running on http://localhost:${port}`);
});
