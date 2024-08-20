import { Response } from "express";

const successResponseHandler = (
  status: number = 200,
  message: string,
  data?: string[] | object,
  count?: number,
  res?: Response
) => {
  if (res) {
    res.status(status).json({
      status: true,
      message: message,
      count: count,
      data: data,
    });
  }
};

const errorResponseHandler = (
  status: number = 400,
  message: string,
  data: any = null,
  res?: Response
) => {
  console.error(`Error: ${message}, Status: ${status}`, data);

  if (res) {
    res.status(status).json({
      success: false,
      message: message,
      data: data,
    });
  }
};

export { successResponseHandler, errorResponseHandler };
