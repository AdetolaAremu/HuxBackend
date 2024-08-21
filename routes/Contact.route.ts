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

router.get("/", getAllContacts);

router.use(privateRoute); // authorized routes

router.post("/", createContact);
router
  .route("/:id")
  .get(getOneContact)
  .patch(updateContact)
  .delete(deleteContact);

export default router;
