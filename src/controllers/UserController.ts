import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@repositories/UsersRepository';
import { AppError } from '@errors/AppError';
import {
  validateId,
  validateStore,
  validateUpdate,
  validateLogin,
  validateConfirmPassword
} from '@Utils/validators/userValidate';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const key = '4f93ac9d10cb751b8c9c646bc9dbccb9';
class UserController {
  async store(request: Request, response: Response) {
    const { name, email, master, password, confirmPassword } = request.body;

    await validateStore({ name, email });

    await validateConfirmPassword({ password, confirmPassword });

    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await userRepository.findOne({
      email: email.toLowerCase()
    });

    if (userAlreadyExists) {
      throw new AppError('Este Usuário Já Existe!', 409);
    }

    try {
      const userData = userRepository.create({
        name,
        email: email.toLowerCase(),
        password,
        master
      });
      const user = await userRepository.save(userData);
      return response
        .json({
          id: user.id,
          name: user.name,
          email: user.email,
          master: user.master,
          createdAt: user.created_at,
          updated_at: user.updated_at
        })
        .status(201);
    } catch (error) {
      throw new AppError(error);
    }
  }

  async findAll(request: Request, response: Response) {
    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.find();

    if (!userAlreadyExists) {
      throw new AppError('Usuário não Encontrado!', 404);
    }
    return response
      .json(
        userAlreadyExists.map((user) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            master: user.master,
            createdAt: user.created_at,
            updated_at: user.updated_at
          };
        })
      )
      .status(200);
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    await validateId(id);

    const userRepository = getCustomRepository(UsersRepository);
    const user = await userRepository.findOne({ id });

    if (!user) {
      throw new AppError('Usuário não Encontrado!', 404);
    }

    return response
      .json({
        id: user.id,
        name: user.name,
        email: user.email,
        master: user.master,
        createdAt: user.created_at,
        updated_at: user.updated_at
      })
      .status(200);
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body;
    await validateLogin(email, String(password));
    const usersRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await usersRepository.findOne({ email });

    if (!userAlreadyExists) {
      throw new AppError('Usuário não Encontrado!', 404);
    }
    const payloadId = userAlreadyExists.id;
    console.log(String(password));
    console.log(userAlreadyExists.password);
    const condition = await bcrypt.compare(
      String(password),
      userAlreadyExists.password
    );

    if (!condition) {
      return response.status(400).json({ error: 'Senha Incorreta!' });
    }
    const token = jwt.sign(
      { payloadId, master: userAlreadyExists.master },
      key,
      {
        subject: String(userAlreadyExists.id),
        expiresIn: '1h'
      }
    );
    return response.status(200).json({ user: { ...userAlreadyExists }, token });
  }

  async update(request: Request, response: Response) {
    let { id } = request.params;
    let { name, email, master, password, confirmPassword } = request.body;
    password = String(password);
    confirmPassword = String(confirmPassword);
    await validateId(id);

    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.findOne({ id });

    if (!userAlreadyExists) {
      throw new AppError('Usuário não Encontrado!', 404);
    }

    await validateUpdate({ name, email });
    const userEmailAlreadyExists = await userRepository.findOne({ email });

    if (
      userEmailAlreadyExists &&
      userEmailAlreadyExists.id !== userAlreadyExists.id
    ) {
      throw new AppError('Este Email Já Existe!', 409);
    }

    if (password && confirmPassword) {
      await validateConfirmPassword({ password, confirmPassword });
      if (
        userAlreadyExists.name == name &&
        userAlreadyExists.email == email &&
        userAlreadyExists.password == password &&
        userAlreadyExists.master == master
      ) {
        throw new AppError('Esta Alteração já foi feita!', 409);
      }
    } else {
      if (userAlreadyExists.name == name && userAlreadyExists.email == email) {
        throw new AppError('Esta Alteração já foi feita!', 409);
      }
    }

    id = id ? id : userAlreadyExists.id;
    (name = name ? name : userAlreadyExists.name),
      (email = email ? email : userAlreadyExists.email),
      (master = master ? master : userAlreadyExists.master),
      (password =
        password && confirmPassword ? password : userAlreadyExists.password);
    const user = userRepository.create({ name, email, master, password });

    try {
      await userRepository.update(id, user);
      return response.json({ id, ...user }).status(200);
    } catch (error) {
      throw new AppError(error);
    }
  }

  async destroy(request: Request, response: Response) {
    const { id } = request.params;
    await validateId(id);
    const usersRepository = getCustomRepository(UsersRepository);
    const [userAlreadyExists] = await usersRepository.find({ id });

    if (!userAlreadyExists) {
      throw new AppError('Usuário não Encontrado!', 404);
    }

    try {
      await usersRepository.delete(userAlreadyExists.id);
      return response.sendStatus(200);
    } catch (error) {
      throw new AppError(error);
    }
  }
}
export default new UserController();
