import { AppError } from '@errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';

function errorMiddleware(
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction
) {
  console.log('err: ' + err.constructor.name);
  if (err instanceof ValidationError) {
    return response.status(400).json({
      message: err.errors
    });
  }
  if (err instanceof AppError) {
    if (err.message.name == 'QueryFailedError' && err.message.code == '') {
      return response.status(409).json({
        type: err.message.name,
        message: err.message.message,
        code: err.message.code
      });
    } else {
      return response.status(err.statusCode).json({
        error: err.message
      });
    }
  }
  return response.status(500).json({
    error: `Internal Server Error ${err.message}`
  });
}
export { errorMiddleware };
