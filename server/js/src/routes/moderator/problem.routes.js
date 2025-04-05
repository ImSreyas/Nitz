import { Router } from "express";
import {
  getProblem,
  getStarterCode,
} from "../../controllers/problem.controller.js";

const router = Router();

router.get("/", getProblem);
router.get("/starter-code", getStarterCode);

export default router;
