import { DataSource } from 'typeorm';
import { config } from './config';

const { postgres_username, postgres_password, postgres_db } = config;

const port_db = Number(config.port_db) || 5432;

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: port_db,
  username: postgres_username,
  password: postgres_password,
  database: postgres_db,
  migrations: ['./src/migrations/*.ts'],
  entities: ['./src/entities/*.ts'],
});
