import { Router } from "express";
import { addProblem, deleteProblem, getProblems, getProblemsList } from "../../controllers/problem.controller.js";

const router = Router();

router.get("/list", getProblemsList)
router.get("/", getProblems);
router.post("/", addProblem);
router.delete("/", deleteProblem)

export default router;
