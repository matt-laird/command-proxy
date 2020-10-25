import { NextFunction, Request, Response } from 'express';
import { CreateScriptDto } from '../dtos/script-dto';
import ExecutionService from '../services/execution-service';

export default class ExecuteController {
  private static service = new ExecutionService();

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const scriptData: CreateScriptDto = req.body;

    try {
      const result = await ExecuteController.service.execute(scriptData);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
