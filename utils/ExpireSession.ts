import { Response } from "express";

const jwt = require("jsonwebtoken");

export const expireToken = (token: string, res: Response) => {
  try {
    const payload = jwt.decode(token);

    if (typeof payload === "object" && payload !== null) {
      delete payload.exp;

      jwt.sign({ ...payload }, process.env.JWT_SECRET as string, {
        expiresIn: "1ms",
      });

      res.json({
        status: "success",
        message: "Token expired successfully",
      });
    }
  } catch (error) {
    console.log("error", error);

    res.json({
      status: "fail",
      message: "Invalid token",
    });
  }
};
