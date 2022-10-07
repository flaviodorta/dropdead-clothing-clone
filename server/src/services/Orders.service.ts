import {
  customersRepository,
  ordersRepository,
  productsRepository,
} from '../repositories';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  id: string;
  customer_id: string;
  products: IProduct[];
}

export class OrdersService {
  public async create({
    customer_id,
    products,
  }: Pick<IRequest, 'customer_id' | 'products'>) {
    const customerExists = await customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new Error('Could not find any customer with given id');
    }

    const existsProducts = await productsRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new Error('Could not find any product with given id');
    }

    const existsProductsIds = existsProducts.map((product) => product.id);

    const checkInexistentProducts = products.filter(
      (product) => !existsProductsIds.includes(product.id)
    );

    if (checkInexistentProducts.length) {
      throw new Error(`Not find products: ${checkInexistentProducts[0].id}`);
    }

    const quantityAvailable = products.filter(
      (product) =>
        existsProducts.filter((p) => p.id === product.id)[0].quantity <
        product.quantity
    );

    if (quantityAvailable.length) {
      throw new Error(
        `The quantity ${quantityAvailable[0].id} is not available for ${quantityAvailable[0].id}`
      );
    }

    const serializedProducts = products.map((product) => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter((p) => p.id === product.id)[0].price,
    }));

    const order = await ordersRepository.createOrder({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updatedProductQuantity = order_products.map((product) => ({
      id: product.product_id,
      quantity:
        existsProducts.filter((p) => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await productsRepository.save(updatedProductQuantity);

    return order;
  }

  public async getById({ id }: Pick<IRequest, 'id'>) {
    const order = await ordersRepository.findById(id);

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }
}

export const ordersService = new OrdersService();
