import express from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  updateContact,
} from "../controllers/ContactController";
import { privateRoute } from "../controllers/AuthController";
const router = express.Router();

router.get("/", getAllContacts);

router.post("/", createContact);
router
  .route("/:id")
  .patch(privateRoute, updateContact)
  .delete(privateRoute, deleteContact);

export default router;
