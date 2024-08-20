import { promisify } from "util";
const jwt = require("jsonwebtoken");
import { NextFunction, Request, Response, response } from "express";
import { CustomRequest, IUserDocument } from "../types/User.interface";
import { catchAsync } from "../utils/CatchAsync";
import AppError from "../utils/AppError";
import { expireToken } from "../utils/ExpireSession";
const User = require("../models/User.model");

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

    if (!(await user.correctPassword(password, user.password))) {
      return next(new AppError("Email and Password do not match", 400));
    }
    const token = jwtSignedToken(user.id);

    const jwtExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN
      ? Number(process.env.JWT_COOKIE_EXPIRES_IN)
      : 1;

    const expiresIn = new Date(Date.now() + jwtExpiresIn * 24 * 60 * 60 * 1000);

    res.json({
      status: "success",
      message: "Login successul",
      token,
      expiresIn,
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
