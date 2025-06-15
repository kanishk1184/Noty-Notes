import express from "express";
import { login, signup, checkMail, checkToken } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/checkMail
router.post("/checkMail", checkMail);

// POST /api/auth/checkToken
router.post("/checkToken", checkToken);

export default router;
