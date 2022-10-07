import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from '../config';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('Token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, config.jwt.secret) as ITokenPayload;

    const { sub } = decodedToken;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new Error('Invalid token');
  }
};
