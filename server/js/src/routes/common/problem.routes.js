import { Router } from "express";
import {
  addProblem,
  addProblemDiscussion,
  deleteProblem,
  fetchProblemAttendStatus,
  getProblemDiscussions,
  getProblems,
  getProblemsList,
  updateProblem,
} from "../../controllers/problem.controller.js";

const router = Router();

router.get("/list", getProblemsList);
router.get("/", getProblems);
router.get("/discussion/:problemId", getProblemDiscussions);
router.post("/discussion/:problemId", addProblemDiscussion);
router.post("/", addProblem);
router.put("/", updateProblem);
router.delete("/", deleteProblem);
router.get("/attend-status", fetchProblemAttendStatus);

export default router;
