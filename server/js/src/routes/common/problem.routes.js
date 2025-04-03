import { Router } from "express";
import { addProblem, getProblems } from "../../controllers/problem.controller.js";

const router = Router();

router.get("/", getProblems);
router.post("/", addProblem);

export default router;
