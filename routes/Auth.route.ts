import express from "express";
import {
  loginUser,
  logoutUser,
  registerNewUser,
} from "../controllers/AuthController";
const router = express.Router();

router.post("/register", registerNewUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
