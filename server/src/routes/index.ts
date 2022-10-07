import { Router } from 'express';
import { customersRouter } from './Customers.route';
import { passwordRouter } from './Password.route';
import { profileRouter } from './Profile.route';
import { sessionsRouter } from './Sessions.route';
import { productsRouter } from './Products.route';
import { usersRouter } from './Users.route';
import { ordersRouter } from './Orders.route';

export const routes = Router();

routes.use('/products', productsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/customers', customersRouter);
routes.use('/orders', ordersRouter);
