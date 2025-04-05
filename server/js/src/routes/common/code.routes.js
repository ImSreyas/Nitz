import { Router } from "express";
import { executeCode } from "../../controllers/code.controller.js";

const router = Router();

router.post("/", executeCode);

export default router;