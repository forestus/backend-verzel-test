import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
interface IPayload {
  sub: string;
  master: boolean;
}

function ensureMaster(
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
    const { master } = verify(
      token,
      '4f93ac9d10cb751b8c9c646bc9dbccb9'
    ) as IPayload;
    if (!master) {
      return response.sendStatus(401);
    }
    console.log(master);
    return _next();
  } catch (error) {
    return response.sendStatus(401);
  }
}
export { ensureMaster };
