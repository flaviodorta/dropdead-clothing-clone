import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { usersController } from '../controllers/Users.controller';

export const passwordRouter = Router();

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  usersController.sendForgotPasswordEmail
);

passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  usersController.resetForgotPasswordEmail
);
