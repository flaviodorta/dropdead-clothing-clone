import { Request, Response } from 'express';
import { productsServices } from '../services/Products.service';

interface IBody {
  id: string;
  title: string;
  price: number;
  quantity: number;
  description: string;
  searchedText: string;
}

interface IRequest extends Request {
  body: IBody;
}

class ProductsController {
  public async getAll(req: Request, res: Response): Promise<Response> {
    const allProducts = await productsServices.getAll();

    return res.json(allProducts);
  }

  public async getByText(req: IRequest, res: Response): Promise<Response> {
    const { searchedText } = req.body;

    const product = await productsServices.getBySearchedText({ searchedText });

    return res.json(product);
  }

  public async create(req: IRequest, res: Response): Promise<Response> {
    const { title, description, price, quantity } = req.body;

    const product = await productsServices.create({
      title,
      description,
      price,
      quantity,
    });

    return res.json(product);
  }

  public async update(req: IRequest, res: Response): Promise<Response> {
    const { title, description, price, quantity } = req.body;
    const { id } = req.params;

    const product = await productsServices.update({
      id,
      title,
      description,
      price,
      quantity,
    });

    return res.json(product);
  }

  public async delete(req: IRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    await productsServices.delete({ id });

    return res.json([]);
  }
}

export const productsController = new ProductsController();
