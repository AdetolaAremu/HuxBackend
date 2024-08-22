// we are extending the Error class and inheriting its methods
class AppError extends Error {
  public status: string;
  public isOperational: boolean;
  public keyValue?: { [key: string]: string };
  public code?: number;

  constructor(
    public message: string,
    public statusCode: number,
    additionalProperties?: {
      keyValue?: { [key: string]: string };
      code?: number;
    }
  ) {
    super(message);

    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    if (additionalProperties?.keyValue) {
      this.keyValue = additionalProperties.keyValue;
    }

    if (additionalProperties?.code) {
      this.code = additionalProperties.code;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
