import { NextFunction, Response, Request } from "express";

export interface RequestWithUser extends Request {
  user: { id: number };
}

// Placeholder middleware LH 2023-02-15
export const fakeAuthMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  req.user = { id: 1 };
  next();
};
