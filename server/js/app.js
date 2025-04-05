import express from "express";
import dotenv from "dotenv";
import problemRoutes from "./src/routes/common/problem.routes.js";
import codeRoute from "./src/routes/common/code.routes.js";
import modProblemRoutes from "./src/routes/moderator/problem.routes.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true, 
  })
);

app.use(express.json());

app.use("/api/problem", problemRoutes);
app.use("/api/moderator/problem", modProblemRoutes);
app.use("/api/code/", codeRoute);

export default app;
