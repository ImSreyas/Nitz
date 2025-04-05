import { Router } from "express";
import {
  getProblem,
  getPublishStatus,
  setPublishStatus
} from "../../controllers/problem.controller.js";

const router = Router();

router.get("/", getProblem);
router.get("/publish-status", getPublishStatus);
router.post("/publish-status", setPublishStatus);

export default router;
