import { CastError, Error as MongooseError } from "mongoose";
import { Response, Request, NextFunction } from "express";

interface FieldsError extends Error {
  keyValue: String;
  statusCode: number;
  status: String;
  isOperational: boolean;
  code: number;
}

const appErrror = require("../utils/AppError");

const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new appErrror(message, 400);
};

const handleDuplicateFieldsDB = (err: FieldsError) => {
  const value = Object.values(err.keyValue);
  const message = `Duplicate field value: ${value[0]}. Please use another value`;
  return new appErrror(message, 404);
};

const handleValidationErrorDB = (err: MongooseError.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new appErrror(message, 422);
};

const handleJWTError = () =>
  new appErrror("Invalid token. Please login again!", 401);

const handleJWTExpiredError = () =>
  new appErrror("Your token has been expired! Please login again", 401);

const sendErrorDev = (err: FieldsError, req: Request, res: Response) => {
  // A) API
  if (req.url.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err: FieldsError, req: Request, res: Response) => {
  // A) APIs
  if (req.url.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // 1) Log error
    console.log("ERROR 💥", err);

    // 2) Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

// GLOBAL ERROR HANDLING MIDLEWARE
module.exports = (
  err: FieldsError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    if (error instanceof MongooseError.CastError)
      error = handleCastErrorDB(error as MongooseError.CastError);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error instanceof MongooseError.ValidationError)
      error = handleValidationErrorDB(error as MongooseError.ValidationError);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
