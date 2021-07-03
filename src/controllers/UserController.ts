import { Request, Response } from 'express';
import { getCustomRepository, Like } from 'typeorm';
import { UsersRepository } from '@repositories/UsersRepository';
import { AppError } from '@errors/AppError';
import {
  validateName,
  validateId,
  validateStore,
  validateUpdate,
  validateLogin
} from '@Utils/validators/userValidate';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const key = '4f93ac9d10cb751b8c9c646bc9dbccb9';
class UserController {
  // Cria um usuário.
  async store(request: Request, response: Response) {
    const { name, email, password } = request.body;
    const admin: boolean = false;

    // validation
    await validateStore(name, email, password);

    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.findOne({ email });

    if (userAlreadyExists) {
      throw new AppError('User Already Exists!', 409);
    }

    try {
      const userData = userRepository.create({
        name,
        email,
        password,
        admin
      });
      const user = await userRepository.save(userData);
      return response.json(user).status(201);
    } catch (error) {
      throw new AppError(error);
    }
  }

  // Lista todos os usuários cadastrados filtrados pelo campo nome: retorna um array de usuários.
  async findAll(request: Request, response: Response) {
    // validation
    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.find();

    if (!userAlreadyExists) {
      throw new AppError('Users Not Found!', 404);
    }
    return response.json(userAlreadyExists).status(200);
  }

  // Lista um usuário pelo name passado como parâmetro: retorna um único usuário.
  async findByName(request: Request, response: Response) {
    const { name } = request.body;
    // validation
    await validateName(name);

    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.findOne({ name });

    if (!userAlreadyExists) {
      throw new AppError('User Not Found', 404);
    }

    return response.json({ ...userAlreadyExists }).status(200);
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body;
    await validateLogin(email, password);
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findOne({ email });

    const payloadId = user.id;
    if (!user.password) {
      return response
        .status(400)
        .json({ error: 'Email Incorrectly or Does Not Exists' });
    } else {
      const condition = await bcrypt.compare(password, user.password);
      if (!condition) {
        return response.status(400).json({ error: 'password wrong' });
      }
      const token = jwt.sign({ payloadId }, key, {
        subject: String(user.id),
        expiresIn: '1h'
      });
      return response.status(201).json({ user, token });
    }
  }

  // Altera nome, email e password do usuário recebido no corpo da requisição, baseado no id recebido como parâmetro de rota: retorna o usuário alterado com as novas informações.
  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, email, password } = request.body;
    // validation
    await validateId(id);
    await validateUpdate(name, email, password);

    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.findOne({ id });

    if (
      userAlreadyExists.name == name &&
      userAlreadyExists.email == email &&
      userAlreadyExists.password == password
    ) {
      throw new AppError('User Params Already Exists!', 409);
    }

    if (!userAlreadyExists) {
      throw new AppError('User Not Found!', 404);
    }

    try {
      const user = await userRepository.save({
        ...userAlreadyExists,
        name,
        email,
        password
      });
      return response.json(user).status(200);
    } catch (error) {
      throw new AppError(error);
    }
  }

  // Altera o status Admin de um usuário, baseado no id recebido como parâmetro de rota: retorna o usuário alterado com as novas informações.
  // Se o usuário passado já for admin, irá retornar status e mensagem de erro.
  async updateAdmin(request: Request, response: Response) {
    const { id } = request.params;
    const { admin } = request.body;

    // validation
    await validateId(id);

    const userRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await userRepository.findOne({ id });

    if (!userAlreadyExists) {
      throw new AppError('User Not Found!', 404);
    }
    if (userAlreadyExists.admin == admin) {
      throw new AppError('Already Done!', 409);
    }
    try {
      const user = await userRepository.save({
        ...userAlreadyExists,
        admin
      });
      return response.json(user).status(200);
    } catch (error) {
      throw new AppError(error);
    }
  }

  // Deleta um usuário baseado no id recebido como parâmetro de rota: retorna o status de sucesso.
  async destroy(request: Request, response: Response) {
    const { id } = request.params;
    // validation
    await validateId(id);

    const usersRepository = getCustomRepository(UsersRepository);
    const [userAlreadyExists] = await usersRepository.find({ id });

    if (!userAlreadyExists) {
      throw new AppError('User Not Found!', 404);
    }
    try {
      await usersRepository.delete(userAlreadyExists.id);
      return response.status(200).json(userAlreadyExists);
    } catch (error) {
      throw new AppError(error);
    }
  }
}
export default new UserController();
