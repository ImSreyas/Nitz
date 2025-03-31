import { Router } from "express";
import { addProblem, getProblem } from "../../controllers/problem.controller.js";

const router = Router();

router.get("/", getProblem);
router.post("/", addProblem);

export default router;
