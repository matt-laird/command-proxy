import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/http-exception';

export default function tokenMiddleware(req: Request, res: Response, next: NextFunction): void {
  let exception;
  const reqToken = req.header('x-api-token');

  if (!reqToken) {
    exception = new HttpException(400, 'No API token provided.');
  } else if (reqToken !== process.env.API_TOKEN) {
    exception = new HttpException(401, 'API token unauthorized')
  }

  next(exception);
}
