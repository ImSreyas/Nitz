import { Router } from "express";
import { getStarterCode, updateStarterCode } from "../../controllers/code.controller.js";

const router = Router();

router.get("/starter-code", (req, res) =>
  getStarterCode(req, res, "moderator")
);
router.post("/starter-code", updateStarterCode);

export default router;
