import { AppError } from '@errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';
import translate from 'translate';
async function errorMiddleware(
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction
) {
  if (err instanceof ValidationError) {
    return response.status(400).json({
      error: await translate(err.errors)
    });
  }
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      error: await translate(err.message)
    });
  }
  return response.status(500).json({
    error: `Erro Interno do Servidor! - ${await translate(err.message)}`
  });
}
export { errorMiddleware };
