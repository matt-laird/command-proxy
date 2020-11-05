import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import logger from 'morgan';
import Routes from './interfaces/routes-interface';
import errorMiddleware from './middlewares/error-middleware';
import { envValue } from './utils/util';

export default class App {
  app: express.Application;
  port: number;
  corsOrgins: string[];
  env: boolean;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = envValue<boolean>('isProduction');
    this.port = envValue('PORT');
    this.corsOrgins = JSON.parse(envValue('CORS_ORIGINS'));

    if (envValue<boolean>('EXPOSE_SWAGGER')) {
      this.initializeSwagger();
    }

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares() {
    if (this.env) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(logger('combined'));
      this.app.use(cors({ origin: this.corsOrgins }));
    } else {
      this.app.use(logger('dev'));
      this.app.use(cors({ origin: true }));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    // tslint:disable-next-line: no-require-imports
    const swaggerJSDoc = require('swagger-jsdoc');
    // tslint:disable-next-line: no-require-imports
    const swaggerUi = require('swagger-ui-express');

    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}
