import 'dotenv/config';
import App from './app';
import ExecuteRoute from './routes/execute-route';
import validateEnv from './utils/validate-env';

validateEnv();

const app = new App([
  new ExecuteRoute()
]);

app.listen();
