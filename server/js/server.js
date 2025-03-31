import app from "./app.js";
import express from "express";
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
