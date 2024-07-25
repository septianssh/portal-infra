// routes/auth.js
import { Router } from "express";
import { signIn, signOut } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signin", signIn);
router.get("/signout", authMiddleware, signOut);
// router.post("/register", register);

export default router;
