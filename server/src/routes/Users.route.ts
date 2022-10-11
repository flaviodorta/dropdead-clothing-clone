import multer from 'multer';
import { Router } from 'express';
import { usersController } from '../controllers/Users.controller';
import { celebrate, Joi, Segments } from 'celebrate';
import { isAuthenticated } from '../middleware/Auth.middleware';
import { uploadConfig } from '../helpers/upload';

export const usersRouter = Router();

const upload = multer(uploadConfig.multer);

usersRouter.get('/', isAuthenticated, usersController.getAll);

usersRouter.get('/:id', usersController.getById);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create
);

usersRouter.post(
  '/sessions',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create
);

usersRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      avatar: Joi.string().required(),
    },
  }),
  usersController.update
);

usersRouter.delete(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  usersController.delete
);

usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  usersController.updateAvatar
);
