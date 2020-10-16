import { Request, Response } from 'express';

export const root = (req: Request, res: Response) => {
  res.json({
    message: 'Hello World',
    version: '1.0.0',
  });
};
