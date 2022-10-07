import { Router } from 'express';
import { productsController } from '../controllers/Products.controller';
import { celebrate, Joi, Segments } from 'celebrate';

export const productsRouter = Router();

productsRouter.get('/', productsController.getAll);

productsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  productsController.getAll
);

productsRouter.get(
  '/search',
  celebrate({
    [Segments.BODY]: {
      searchedText: Joi.string(),
    },
  }),
  productsController.getByText
);

productsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      quantity: Joi.number().required(),
    },
  }),
  productsController.create
);

productsRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      quantity: Joi.number().required(),
    },
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  productsController.update
);

productsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  productsController.delete
);
