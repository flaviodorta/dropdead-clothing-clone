import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  config: {
    redis: RedisOptions;
  };
  driver: string;
}

export const cacheConfig = {
  config: {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT as number | undefined,
      password: process.env.REDIS_PASS || undefined,
    },
  },
  driver: 'redis',
} as ICacheConfig;
