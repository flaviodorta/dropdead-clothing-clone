import { Request, Response } from 'express';
import { ordersService } from '../services/Orders.service';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  body: {
    id: string;
    customer_id: string;
    products: IProduct[];
  };
  params: {
    id: string;
  };
}

export class OrdersController {
  public async getById(req: IRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    const showOrder = await ordersService.getById({ id });

    return res.json(showOrder);
  }

  public async create(req: IRequest, res: Response): Promise<Response> {
    const { customer_id, products } = req.body;

    const order = await ordersService.create({
      customer_id,
      products,
    });

    return res.json(order);
  }
}

export const ordersController = new OrdersController();
