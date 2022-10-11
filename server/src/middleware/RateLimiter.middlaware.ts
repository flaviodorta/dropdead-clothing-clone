import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const redisClient = new Redis({
      host: process.env.REDIS_HOST as string,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASS || undefined,
    });

    const limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'ratelimit',
      points: 1,
      duration: 1,
    });

    await limiter.consume(req.ip);

    return next();
  } catch (err) {
    throw new Error('Too many requests.');
  }
};
