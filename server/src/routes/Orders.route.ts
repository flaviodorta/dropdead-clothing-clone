import { Router } from 'express';
import { ordersController } from '../controllers/Orders.controller';
import { celebrate, Joi, Segments } from 'celebrate';
import { isAuthenticated } from '../middleware/Auth.middleware';

export const ordersRouter = Router();

ordersRouter.use(isAuthenticated);

ordersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ordersController.getById
);

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().uuid().required(),
      products: Joi.required(),
    },
  }),
  ordersController.create
);
