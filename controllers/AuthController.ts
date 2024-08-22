import { promisify } from "util";
const jwt = require("jsonwebtoken");
import { NextFunction, Request, Response, response } from "express";
import { CustomRequest, IUserDocument } from "../types/User.interface";
import { catchAsync } from "../utils/CatchAsync";
import AppError from "../utils/AppError";
import { expireToken } from "../utils/ExpireSession";
const User = require("../models/User.model");

// sign jwt token and give it an expiry time
const jwtSignedToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

export const registerNewUser = catchAsync(
  async (req: Request, res: Response) => {
    const newUser: IUserDocument = await User.create(req.body);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      newUser,
    });
  }
);

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || !req.body.email || !req.body.password) {
      return next(new AppError("Required body not returned", 422));
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (req.body.email && req.body.password) {
      if (!user) {
        return next(
          new AppError(
            "User does not exist, please reconfirm your credentials",
            404
          )
        );
      }
    }

    // Compare bcrypt passwords
    if (!(await user.correctPassword(password, user.password))) {
      return next(new AppError("Email and Password do not match", 400));
    }
    const token = jwtSignedToken(user.id);

    res.status(200).json({
      message: "Login successful",

      token,
    });
  }
);

export const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    expireToken(token, res);
  } else {
    res.status(400).json({
      status: "fail",
      message: "Ths request is invalid",
    });
  }
});

// this is what will validate our access to private route
export const privateRoute = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not authorized", 401));
    }

    const decodedToken = await promisify(jwt.verify)(
      token,
      process?.env?.JWT_SECRET
    );

    const currentUser = await User.findById(decodedToken.id);

    if (!currentUser) {
      return next(new AppError("Token does not belong to any user", 401));
    }

    req.user = currentUser;
    next();
  }
);
