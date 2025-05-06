import { Router } from "express";
import { getUserPoints } from "../../controllers/user.controller.js";

const router = Router();

router.get("/points", getUserPoints);

export default router;
