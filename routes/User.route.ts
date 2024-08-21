import express from "express";
import { privateRoute } from "../controllers/AuthController";
import { getLoggedInUser } from "../controllers/UserController";

const router = express.Router();

router.get("/logged-in-user", privateRoute, getLoggedInUser);

export default router;
