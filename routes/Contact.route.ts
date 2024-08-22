import express from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  getOneContact,
  updateContact,
} from "../controllers/ContactController";
import { privateRoute } from "../controllers/AuthController";

const router = express.Router();

router.get("/", privateRoute, getAllContacts);

router.post("/", privateRoute, createContact);

router
  .route("/:id")
  .get(privateRoute, getOneContact)
  .patch(privateRoute, updateContact)
  .delete(privateRoute, deleteContact);

export default router;
