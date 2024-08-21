import mongoose, { Model } from "mongoose";
import { IUserDocument } from "../types/User.interface";
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm password is required"],
      validate: {
        validator: function (this: IUserDocument, el: string): boolean {
          return el === this.password;
        },
        message: "Passwords do not match",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (!this.password) {
    return next(new Error("Password is undefined"));
  }

  // console.log("Password before hashing:", this.password);

  this.password = await bcrypt.hash(this.password, 12);
  // console.log("Password after hashing:", this.password);

  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  requestPassword: String,
  $dbPassword: String
) {
  return bcrypt.compare(requestPassword, $dbPassword);
};

const User: Model<IUserDocument> = mongoose.model("User", userSchema);

module.exports = User;
