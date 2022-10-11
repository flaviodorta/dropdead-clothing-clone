import path from 'path';
import fs from 'fs';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { User } from '../entities/User.entity';
import { usersRepository, userTokensRepository } from '../repositories';
import { config } from '../config';
import { uploadConfig } from '../helpers/upload';
import { addHours, isAfter } from 'date-fns';
import { SESMail } from '../helpers/SESMail';
import { mailConfig } from '../helpers/mail';
import { EthrealMail } from '../helpers/EtherealMail';
import { diskStorageProvider } from '../helpers/DiskStorageProvider';
import { s3DiskStorageProvider } from '../helpers/S3DiskStorageProvider';

interface IRequest {
  id: string;
  user_id: string;
  name: string;
  email: string;
  password: string;
  old_password: string;
  avatar: string;
  token: string;
}

export class UsersServices {
  public async getAll(): Promise<User[]> {
    const allUsers = usersRepository.find();

    return allUsers;
  }

  public async getById({ id }: Pick<IRequest, 'id'>): Promise<User> {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new Error('User not exist');
    }

    return user;
  }

  public async create({
    name,
    email,
    password,
  }: Pick<IRequest, 'name' | 'email' | 'password'>): Promise<User> {
    const emailExists = await usersRepository.findByEmail(email);

    if (emailExists) {
      throw new Error('Email addres already userd');
    }

    const hashedPassword = await hash(password, 8);

    const user = await usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }

  public async update({
    id,
    name,
    email,
    password,
  }: Pick<IRequest, 'id' | 'email' | 'name' | 'password'>): Promise<User> {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await usersRepository.save(user);

    return user;
  }

  public async delete({ id }: Pick<IRequest, 'id'>): Promise<void> {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new Error('user not found');
    }

    await usersRepository.remove(user);
  }

  public async createSessions({
    email,
    password,
  }: Pick<IRequest, 'email' | 'password'>): Promise<{
    user: User;
    token: string;
  }> {
    const user = await usersRepository.findByEmail(email);

    if (!user) throw new Error('User not exist');

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) throw new Error('Incorrect password');

    const token = sign({}, config.jwt.secret, {
      subject: user.id,
      expiresIn: config.jwt.expiresIn,
    });

    return { user, token };
  }

  public async updateAvatar({
    id,
    avatar,
  }: Pick<IRequest, 'id' | 'avatar'>): Promise<User> {
    const user = await usersRepository.findById(id);

    if (!user) throw new Error('User not found');

    if (uploadConfig.driver === 's3') {
      console.log('s3');
      if (user.avatar) {
        await s3DiskStorageProvider.deleteFile(user.avatar);
      }
      console.log('s3 avatar: ', avatar);
      const filename = await s3DiskStorageProvider.saveFile(avatar);
      user.avatar = filename;
    } else {
      if (user.avatar) {
        await diskStorageProvider.deleteFile(user.avatar);
      }
      const filename = await diskStorageProvider.saveFile(avatar);
      user.avatar = filename;
    }

    await usersRepository.save(user);

    return user;
  }

  public async sendForgotPasswordEmail({
    email,
  }: Pick<IRequest, 'email'>): Promise<void> {
    const user = await usersRepository.findByEmail(email);

    if (!user) throw new Error('User not exist');

    const { token } = await userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'ForgotPassword.hbs'
    );

    if (mailConfig.driver === 'ses') {
      await SESMail.sendMail({
        to: {
          name: user.name,
          email: user.email,
        },
        subject: '[API Vendas] Recuperação de Senha',
        templateData: {
          file: forgotPasswordTemplate,
          variables: {
            name: user.name,
            link: `http://localhost:3000/reset_password?token=${token}`,
          },
        },
      });
      return;
    }

    await EthrealMail.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[API Vendas] Recuperação de Senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?token=${token}`,
        },
      },
    });
  }

  public async resetForgotPasswordEmail({
    token,
    password,
  }: Pick<IRequest, 'token' | 'password'>): Promise<void> {
    const userToken = await userTokensRepository.findByToken(token);

    if (!userToken) throw new Error('User does not exist');

    const user = await usersRepository.findById(userToken.user_id);

    if (!user) throw new Error('User does not exist');

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) throw new Error('Token expired');

    user.password = await hash(password, 8);

    await usersRepository.save(user);
  }

  public async showProfile({
    user_id,
  }: Pick<IRequest, 'user_id'>): Promise<User> {
    const user = await usersRepository.findById(user_id);

    if (!user) throw new Error('User nnot found');

    return user;
  }

  public async updateProfile({
    user_id,
    name,
    email,
    password,
    old_password,
  }: Pick<
    IRequest,
    'user_id' | 'name' | 'email' | 'password' | 'old_password'
  >): Promise<User> {
    const user = await usersRepository.findById(user_id);

    if (!user) throw new Error('User not found');

    const userUpdateEmail = await usersRepository.findByEmail(email);

    if (userUpdateEmail && userUpdateEmail.id !== user_id) {
      throw new Error('There is already one user with this email');
    }

    if (password && !old_password) {
      throw new Error('Old password is required');
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new Error('Old password does not match');
      }

      user.password = await hash(password, 8);
    }

    user.name = name;
    user.email = email;

    await usersRepository.save(user);

    return user;
  }
}
export const usersServices = new UsersServices();
