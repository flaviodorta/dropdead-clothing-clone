import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';

dotenv.config();

const {
  PORT_SERVER,
  PORT_DB,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  JWT_SECRET,
} = process.env;

export const config = {
  port_server: PORT_SERVER,
  port_db: PORT_DB,
  postgres_username: POSTGRES_USERNAME,
  postgres_password: POSTGRES_PASSWORD,
  postgres_db: POSTGRES_DB,
  jwt: {
    secret: JWT_SECRET as Secret,
    expiresIn: '1d',
  },
};
