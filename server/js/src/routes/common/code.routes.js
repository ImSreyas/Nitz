import { Router } from "express";
import { executeCode } from "../../controllers/code.controller.js";
import { getStarterCode } from "../../controllers/problem.controller.js";

const router = Router();

router.post("/execute", executeCode);
router.get("/starter-code", getStarterCode)

export default router;