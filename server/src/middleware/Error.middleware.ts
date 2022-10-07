import { Request, Response, NextFunction } from 'express';
import Error from '../@types/Error.type';

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Whops, something went wrong!';
  res.status(404).json({ status, message });
};

export default errorMiddleware;
