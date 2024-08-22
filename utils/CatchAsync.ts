import { Request, Response, NextFunction } from "express";

export interface RequestErrorNext {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

// our asynchronous controller wrapper
export const catchAsync = (fn: RequestErrorNext) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
