import express from "express";

const app = express();

app.get("/", (req, res) => res.send("<h1>yeet</h1>"));

const port = 5000;
app.listen(port, () => console.log("listening on port", port));
