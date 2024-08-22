import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";

export const getLoggedInUser = catchAsync(
  async (req: Request | any, res: Response) => {
    // we passed req.user to the private route so we inherit it from privateController, check user.route.ts
    const user = req.user;

    res.json({
      message: "User retrieved successfully",
      data: {
        user,
      },
    });
  }
);
