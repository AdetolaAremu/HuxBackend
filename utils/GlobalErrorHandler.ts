import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";
import { CastError, Error as MongooseError } from "mongoose";
import { MongoServerError } from "mongodb";

interface FieldsError extends Error {
  keyValue?: { [key: string]: string };
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number;
  stack?: string;
}

// handle mongodb cast error
const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// handle duplicate value in the database
const handleDuplicateFieldsDB = (err: MongoServerError) => {
  const value = err.errorResponse?.keyValue?.email;
  const message = value
    ? `Duplicate field value: ${value}. Please use another value.`
    : "Duplicate field value. Please use another value.";

  return new AppError(message, 404);
};

// to handle validations
const handleValidationErrorDB = (err: MongooseError.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 422);
};

// hanle jwt error
const handleJWTError = () =>
  new AppError("Invalid token. Please login again!", 401);
const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please login again", 401);

// structure development environment error
const sendErrorDev = (err: FieldsError, req: Request, res: Response) => {
  if (req.url.startsWith("/api")) {
    return res.status(err.statusCode || 500).json({
      status: err.status || "error",
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

// structure production error
const sendErrorProd = (err: FieldsError, req: Request, res: Response) => {
  if (req.url.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode || 500).json({
        status: err.status || "error",
        message: err.message,
      });
    }

    console.error("ERROR 💥", err);

    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

// GLOBAL ERROR HANDLING MIDLEWARE
const globalErrorHandler = (
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
    let error = { ...err, message: err.message, name: err.name };

    if (error instanceof MongooseError.CastError) {
      error = handleCastErrorDB(error as MongooseError.CastError);
    } else if (error instanceof MongoServerError && error.code === 11000) {
      error = handleDuplicateFieldsDB(error as MongoServerError);
    } else if (error instanceof MongooseError.ValidationError) {
      error = handleValidationErrorDB(error as MongooseError.ValidationError);
    } else if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    } else if (error.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    } else {
      error = new AppError("Something went very wrong!", 500);
    }

    sendErrorProd(error, req, res);
  }
};

export default globalErrorHandler;
