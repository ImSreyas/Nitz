import { Router } from "express";
import {
  addProblemSolution,
  getApprovalStatus,
  getProblem,
  getProblemSolution,
  getPublishStatus,
  setApprovalStatus,
  setPublishStatus,
} from "../../controllers/problem.controller.js";

const router = Router();

router.get("/", getProblem);
router.post("/solution", addProblemSolution);
router.get("/solution/:id", getProblemSolution);
router.get("/publish-status", getPublishStatus);
router.post("/publish-status", setPublishStatus);
router.get("/approval-status", getApprovalStatus);
router.post("/approval-status", setApprovalStatus);

export default router;
