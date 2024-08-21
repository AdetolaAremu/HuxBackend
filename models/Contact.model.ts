import mongoose, { Model } from "mongoose";
import { IContact } from "../types/Contact.interface";
const validator = require("validator");

const contactSchema = new mongoose.Schema<IContact>(
  {
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 150,
      required: [true, "First name is required"],
    },
    middleName: {
      type: String,
      minlength: 3,
      maxlength: 150,
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 150,
      required: [true, "Last name is required"],
    },
    country: {
      type: String,
      minlength: 4,
      maxlength: 150,
      required: [true, "Country is required"],
    },
    location: {
      type: String,
      minlength: 4,
      maxlength: 150,
    },
    contactType: {
      type: String,
      minlength: 4,
      maxlength: 150,
    },
    phoneNumber: {
      type: String,
      maxlength: 12,
      unique: true,
      minlength: 10,
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
