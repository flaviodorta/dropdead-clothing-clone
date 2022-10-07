import 'reflect-metadata';
import 'express-async-errors';
import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { errors } from 'celebrate';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import errorMiddleware from './middleware/Error.middleware';
import { config } from './config';
import { dataSource } from './database';
import { routes } from './routes';
import { uploadConfig } from './helpers/upload';
import { pagination } from 'typeorm-pagination';

const app: Application = express();

dataSource
  .initialize()
  .then(() => {
    const PORT = config.port_server || 8000;

    const limiter = rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests from this IP',
    });

    app.use(cors());
    app.use(express.json());
    app.use(pagination);
    app.use('/files', express.static(uploadConfig.directory));
    app.use(morgan('common'));
    app.use(helmet());
    app.use(limiter);
    app.use(routes);
    app.use(errors());
    app.use(errorMiddleware);

    app.listen(PORT, () => {
      console.log(`Server running in port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Database connection error: ', err);
  });

export default app;
