import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@repositories/UsersRepository';
import { AppError } from '@errors/AppError';
import {
  validateName,
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
      throw new AppError('User Already Exists!', 409);
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
      throw new AppError('Users Not Found!', 404);
    }
    return response.json(userAlreadyExists).status(200);
  }

  async findOne(request: Request, response: Response) {
    const { id } = request.params;
    await validateId(id);

    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.findOne({ id });

    if (!userAlreadyExists) {
      throw new AppError('User Not Found', 404);
    }

    return response.json({ ...userAlreadyExists }).status(200);
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body;
    await validateLogin(email, password);
    const usersRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await usersRepository.findOne({ email });

    if (!userAlreadyExists) {
      throw new AppError('User Not Found', 404);
    }
    const payloadId = userAlreadyExists.id;

    const condition = await bcrypt.compare(
      password,
      userAlreadyExists.password
    );
    if (!condition) {
      return response.status(400).json({ error: 'password wrong' });
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
    const { id } = request.params;
    const { name, email, master, password, confirmPassword } = request.body;
    await validateId(id);

    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.findOne({ id });

    if (!userAlreadyExists) {
      throw new AppError('User Not Found!', 404);
    }

    await validateUpdate({ name, email });

    if (password && confirmPassword) {
      await validateConfirmPassword({ password, confirmPassword });
      if (
        userAlreadyExists.name == name &&
        userAlreadyExists.email == email &&
        userAlreadyExists.password == password &&
        userAlreadyExists.master == master
      ) {
        throw new AppError('User Params Already Exists!', 409);
      }
    } else {
      if (userAlreadyExists.name == name && userAlreadyExists.email == email) {
        throw new AppError('User Params Already Exists!', 409);
      }
    }

    try {
      const user = await userRepository.save({
        ...userAlreadyExists,
        name,
        email,
        master,
        password:
          password && confirmPassword ? password : userAlreadyExists.password
      });
      return response.json(user).status(200);
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
      throw new AppError('User Not Found!', 404);
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
