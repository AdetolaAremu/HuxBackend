import mongoose, { Model } from "mongoose";
import { IContact } from "../types/Contact.interface";
const validator = require("validator");

const contactSchema = new mongoose.Schema<IContact>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      unique: true,
      required: false,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
  },
  {
    timestamps: true,
  }
);

const Contact: Model<IContact> = mongoose.model("Contact", contactSchema);

module.exports = Contact;
