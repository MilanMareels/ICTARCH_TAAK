const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();
const port = 8080;

app.use("/auth", createProxyMiddleware({ target: "http://localhost:4000", changeOrigin: true }));
app.use("/game-catalog", createProxyMiddleware({ target: "http://localhost:3000", changeOrigin: true }));
app.use("/ratings", createProxyMiddleware({ target: "http://localhost:3001", changeOrigin: true }));
app.use("/recommendations", createProxyMiddleware({ target: "http://localhost:3002", changeOrigin: true }));
app.use("/notifications", createProxyMiddleware({ target: "http://localhost:3003", changeOrigin: true }));
app.use("/users", createProxyMiddleware({ target: "http://localhost:3004", changeOrigin: true }));

app.listen(port, () => {
  console.log(`API Gateway running on http://localhost:${port}`);
});
