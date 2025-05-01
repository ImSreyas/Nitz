import { Router } from "express";
import {
  blockModerator,
  blockUser,
  getAllModerators,
  getAllUsers,
  getDashboardDetails,
  updateModerator,
  updateUser,
} from "../../controllers/admin.controller.js";

const router = Router();

router.get("/dashboard", getDashboardDetails);
router.get("/users", getAllUsers);
router.get("/moderators", getAllModerators);
router.put("/users/:id", updateUser);
router.put("/moderators/:id", updateModerator);
router.put("/user/block/:id", blockUser);
router.put("/moderator/block/:id", blockModerator);

export default router;
