import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";

export const getLoggedInUser = catchAsync(
  async (req: Request | any, res: Response) => {
    const user = req.user;

    res.json({
      message: "User retrieved successfully",
      data: {
        user,
      },
    });
  }
);
