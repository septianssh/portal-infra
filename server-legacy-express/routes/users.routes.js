import { Router } from "express";
import bodyParser from "body-parser";
import {
  createUser,
  readUserList,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(bodyParser.json());

router.post("/user_lists", authMiddleware, readUserList);
router.post("/create_user", authMiddleware, verifyRole(["admin"]), createUser);
router.put("/update_user/:id", authMiddleware, verifyRole(["admin"]), updateUser);
router.delete("/delete_user/:id", authMiddleware, verifyRole(["admin"]), deleteUser);

export default router;
