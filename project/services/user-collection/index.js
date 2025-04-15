const express = require("express");
const app = express();

app.get("/collection", (req, res) => {
  res.json([
    { id: 1, title: "Hades", platform: "PC" },
    { id: 2, title: "Zelda", platform: "Switch" },
  ]);
});

app.get("/metrics", (req, res) => res.send("# HELP collection_metric 1\ncollection_metric 1"));

app.listen(3000, () => console.log("User-collection running on port 3000"));
