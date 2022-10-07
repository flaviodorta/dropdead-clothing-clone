import { In } from 'typeorm';
import { dataSource } from '../database';
import { Customer } from '../entities/Customer.entity';
import { Order } from '../entities/Order.entity';
import { Product } from '../entities/Product.entity';
import { User } from '../entities/User.entity';
import { UserToken } from '../entities/UserToken.entity';

interface IFindProducts {
  id: string;
}

interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer: Customer;
  products: IProduct[];
}

export const productsRepository = dataSource.getRepository(Product).extend({
  async findByTitle(title: string) {
    const product = this.findOne({
      where: {
        title,
      },
    });

    return product;
  },

  async findById(id: string) {
    return this.createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();
  },

  async findAllByIds(products: IFindProducts[]) {
    const productIds = products.map((product) => product.id);
    const existsProducts = await this.find({
      where: {
        id: In(productIds),
      },
    });
    console.log(existsProducts);
    return existsProducts;
  },
});

export const usersRepository = dataSource.getRepository(User).extend({
  async findByName(name: string) {
    return this.createQueryBuilder('user')
      .where('user.name = :name', { name })
      .getOne();
  },
  async findByEmail(email: string) {
    return this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  },
  async findById(id: string) {
    return this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  },
});

export const userTokensRepository = dataSource.getRepository(UserToken).extend({
  async findByToken(token: string) {
    const userToken = await this.findOne({
      where: {
        token,
      },
    });
    return userToken;
  },
  async findByEmail(email: string) {
    return this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  },
  async generate(user_id: string) {
    const userToken = await this.create({
      user_id,
    });
    await this.save(userToken);
    return userToken;
  },
});

export const customersRepository = dataSource.getRepository(Customer).extend({
  async findByName(name: string) {
    return this.createQueryBuilder('customer')
      .where('customer.name = :name', { name })
      .getOne();
  },
  async findByEmail(email: string) {
    return this.createQueryBuilder('customer')
      .where('customer.email = :email', { email })
      .getOne();
  },
  async findById(id: string) {
    return this.createQueryBuilder('customer')
      .where('customer.id = :id', { id })
      .getOne();
  },
});

export const ordersRepository = dataSource.getRepository(Order).extend({
  async findById(id: string) {
    const order = await this.findOne({
      where: {
        id,
      },
      relations: ['order_products', 'customer'],
    });

    return order;
  },

  async createOrder({ customer, products }: IRequest) {
    const order = await this.create({
      customer,
      order_products: products,
    });

    await this.save(order);

    return order;
  },
});
