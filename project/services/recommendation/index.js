const express = require("express");
const app = express();

app.get("/recommendations", (req, res) => {
  res.json([
    { id: 101, title: "Celeste", reason: "Similar to your liked games" },
    { id: 102, title: "Hollow Knight", reason: "Popular among similar users" },
  ]);
});

app.get("/metrics", (req, res) => res.send("# HELP rec_metric 1\nrec_metric 1"));

app.listen(3000, () => console.log("Recommendation service on port 3000"));
