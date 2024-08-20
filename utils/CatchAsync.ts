import { Request, Response, NextFunction } from "express";

export interface RequestErrorNext {
  (req: Request, res?: Response, next?: NextFunction): Promise<any>;
}

module.exports = (fn: RequestErrorNext) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
