import { Router } from "express";
import { addProblem, deleteProblem, getProblems } from "../../controllers/problem.controller.js";

const router = Router();

router.get("/", getProblems);
router.post("/", addProblem);
router.delete("/", deleteProblem)

export default router;
