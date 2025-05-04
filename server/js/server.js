import app from "./app.js";
import express from "express";
import { exec } from "child_process";

const PORT = process.env.PORT || 4000;

app.use(express.json());

// Pull Docker images when the server starts
const dockerPullCommand = `
  docker pull python:3.11-alpine && \
  docker pull openjdk:21-slim && \
  docker pull gcc:13.2.0 && \
  docker pull rust:1.76 && \
  docker pull golang:1.21 && \
  docker pull swift:5.9 && \
  docker pull zenika/kotlin
`;

exec(dockerPullCommand, (error, stdout, stderr) => {
  if (error) {
    console.error("Error pulling Docker images:", error.message);
    return;
  }
  if (stderr) {
    console.error("Docker pull stderr:", stderr);
  }
  console.log("Docker images pulled successfully:\n", stdout);
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
