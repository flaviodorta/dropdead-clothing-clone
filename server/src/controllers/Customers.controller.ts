import { Request, Response } from 'express';
import { customersServices } from '../services/Customers.service';

interface IBody {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  token: string;
}

interface IRequest extends Request {
  body: IBody;
}

class CustomersController {
  public async getAll(req: IRequest, res: Response): Promise<Response> {
    const allCustomers = await customersServices.getAll();

    return res.json(allCustomers);
  }

  public async getById(req: IRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    const user = await customersServices.getById({ id });

    return res.json(user);
  }

  public async create(req: IRequest, res: Response): Promise<Response> {
    const { name, email } = req.body;

    const customer = await customersServices.create({ name, email });

    return res.json(customer);
  }

  public async update(req: IRequest, res: Response): Promise<Response> {
    const { name, email } = req.body;
    const { id } = req.params;

    const user = await customersServices.update({
      id,
      name,
      email,
    });

    return res.json(user);
  }

  public async delete(req: IRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    await customersServices.delete({ id });

    return res.json([]);
  }
}

export const customersController = new CustomersController();
