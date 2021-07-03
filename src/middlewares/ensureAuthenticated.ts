import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
interface IPayload {
  sub: string;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  _next: NextFunction
) {
  const { authorization } = request.headers;
  if (!authorization) {
    return response.sendStatus(401).end();
  }
  const [, token] = authorization.split(' ');
  try {
    verify(token, '4f93ac9d10cb751b8c9c646bc9dbccb9') as IPayload;
    return _next();
  } catch (error) {
    return response.sendStatus(401);
  }
}
export { ensureAuthenticated };
