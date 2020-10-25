import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/http-exception';

export default function apikeyMiddleware(req: Request, res: Response, next: NextFunction): void {
  let exception;
  const reqToken = req.header('x-api-key');

  if (!reqToken) {
    exception = new HttpException(400, 'No API key provided.');
  } else if (reqToken !== process.env.API_KEY) {
    exception = new HttpException(401, 'API key unauthorized');
  }

  next(exception);
}
