import { Router } from "express";
import { getAllModerators, getAllUsers } from "../../controllers/admin.controller.js";

const router = Router();

router.get("/users", getAllUsers);
router.get("/moderators", getAllModerators);

export default router;