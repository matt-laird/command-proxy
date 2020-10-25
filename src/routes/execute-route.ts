import { Router } from 'express';
import ExecuteController from '../controllers/execute-controller';
import { CreateScriptDto } from '../dtos/script-dto';
import Route from '../interfaces/routes-interface';
import tokenMiddleware from '../middlewares/token-middleware';
import validationMiddleware from '../middlewares/validation-middleware';

export default class ExecuteRoute implements Route {
  path = '/execute';
  router = Router();
  private executeController = new ExecuteController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      tokenMiddleware,
      validationMiddleware(CreateScriptDto),
      this.executeController.execute
    );
  }
}
