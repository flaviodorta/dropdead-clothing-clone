import { Customer } from '../entities/Customer.entity';
import { customersRepository } from '../repositories';

interface IRequest {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface IPaginateCustomer {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  data: Customer[];
}

export class CustomerService {
  public async getAll(): Promise<Customer[]> {
    const customers = customersRepository.find();

    return customers;
  }

  public async create({
    name,
    email,
  }: Pick<IRequest, 'name' | 'email'>): Promise<Customer> {
    const emailExists = await customersRepository.findByEmail(email);

    if (emailExists) {
      throw new Error('Email address already used');
    }

    const customer = await customersRepository.create({
      name,
      email,
    });

    await customersRepository.save(customer);

    return customer;
  }

  public async getById({ id }: Pick<IRequest, 'id'>): Promise<Customer> {
    const customer = await customersRepository.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  }

  public async update({
    id,
    name,
    email,
  }: Pick<IRequest, 'id' | 'name' | 'email'>): Promise<Customer> {
    const customer = await customersRepository.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const customerExists = await customersRepository.findByEmail(email);

    if (customerExists && email !== customer.email) {
      throw new Error('There is already one customer with this meail');
    }

    customer.name = name;
    customer.email = email;

    await customersRepository.save(customer);

    return customer;
  }

  public async delete({ id }: Pick<IRequest, 'id'>): Promise<void> {
    const customer = await customersRepository.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    await customersRepository.remove(customer);
  }
}

export const customersServices = new CustomerService();
