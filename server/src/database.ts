import { DataSource } from 'typeorm';
import { config } from './config';

const { postgres_username, postgres_password, postgres_db } = config;

const port_db = Number(config.port_db) || 8000;

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: port_db,
  username: postgres_username,
  password: postgres_password,
  database: postgres_db,
  migrations: [
    process.env.NODE_ENV === 'development'
      ? './src/migrations/*.ts'
      : './dist/migrations/*.js',
  ],
  entities: [
    process.env.NODE_ENV === 'development'
      ? './src/entities/*.ts'
      : './dist/entities/*.js',
  ],
});
