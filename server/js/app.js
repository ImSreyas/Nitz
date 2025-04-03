import express from "express";
import dotenv from "dotenv";
import problemRoutes from "./src/routes/common/problem.routes.js";
import modProblemRoutes from "./src/routes/moderator/problem.routes.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Allow only your Next.js frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true // If you need to send cookies
}));

app.use(express.json());

app.use("/api/problem", problemRoutes);
app.use("/api/moderator/problem", modProblemRoutes);

export default app;
