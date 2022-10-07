import { productsRepository } from '../repositories';
import { Product } from '../entities/Product.entity';
import { Like } from 'typeorm';

interface IRequest {
  id: string;
  title: string;
  price: number;
  quantity: number;
  description: string;
  searchedText: string;
}

export class ProductsService {
  public async getBySearchedText({
    searchedText,
  }: Pick<IRequest, 'searchedText'>): Promise<Product[]> {
    const searchedProductsByTitle = await productsRepository.findBy({
      title: Like(`%${searchedText}%`),
    });
    const searchedProductsByDescription = await productsRepository.findBy({
      description: Like(`%${searchedText}%`),
    });
    const searchedProducts = [
      ...searchedProductsByTitle,
      ...searchedProductsByDescription,
    ];

    return searchedProducts;
  }

  public async getAll(): Promise<Product[]> {
    const allProducts = productsRepository.find();

    return allProducts;
  }

  public async getById({ id }: Pick<IRequest, 'id'>) {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  public async create({
    title,
    description,
    price,
    quantity,
  }: Pick<
    IRequest,
    'title' | 'description' | 'price' | 'quantity'
  >): Promise<Product> {
    if (!description) description = '';

    const product = await productsRepository.create({
      title,
      description,
      price,
      quantity,
    });

    await productsRepository.save(product);

    return product;
  }

  public async update({
    id,
    title,
    description,
    price,
    quantity,
  }: Pick<
    IRequest,
    'id' | 'title' | 'description' | 'price' | 'quantity'
  >): Promise<Product> {
    const product = await productsRepository.findOneBy({ id });

    if (product === null) {
      throw new Error('Product not found');
    }

    product.title = title;
    product.description = description;
    product.price = price;
    product.quantity = quantity;

    await productsRepository.save(product);

    return product;
  }

  public async delete({ id }: Pick<IRequest, 'id'>): Promise<void> {
    const product = await productsRepository.findOneBy({ id });

    if (!product) {
      throw new Error('Product not found');
    }

    await productsRepository.remove(product);
  }
}

export const productsServices = new ProductsService();
