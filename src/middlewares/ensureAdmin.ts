import { Request, Response, NextFunction } from 'express';
import { UsersRepository } from '@repositories/UsersRepository';
import { getCustomRepository } from 'typeorm';

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { userId } = request;

  const usersRepositories = getCustomRepository(UsersRepository);

  const { admin } = await usersRepositories.findOne(userId);

  // Verificar se usuario admin

  if (admin) {
    return next();
  }

  return response.status(401).json({
    error: 'Unauthorized'
  });
}