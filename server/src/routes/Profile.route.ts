import { Router } from 'express';
import { isAuthenticated } from '../middleware/Auth.middleware';
import { usersController } from '../controllers/Users.controller';
import { celebrate, Segments, Joi } from 'celebrate';

export const profileRouter = Router();

profileRouter.use(isAuthenticated);

profileRouter.get('/', usersController.showProfile);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
      old_password: Joi.string(),
      password: Joi.string().optional(),
      password_confirmation: Joi.string()
        .valid(Joi.ref('password'))
        .when('password', {
          is: Joi.exist(),
          then: Joi.required(),
        }),
    },
  }),
  usersController.updateProfile
);
