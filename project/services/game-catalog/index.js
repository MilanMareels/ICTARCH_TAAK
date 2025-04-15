const express = require("express");
const app = express();
app.get("/games", (req, res) => {
  res.json([{ id: 1, title: "Hades", price: 19.99 }]);
});
app.get("/metrics", (req, res) => res.send("# HELP dummy_metric 1\n# TYPE dummy_metric counter\ndummy_metric 1"));
app.listen(3000);
