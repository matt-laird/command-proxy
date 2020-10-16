import * as express from 'express';
import * as bodyParser from 'body-parser';

import { root } from './controllers/root';

const app = express();

app.set('port', 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', root);

app.listen(app.get('port'), () => {
  console.log('App is running at http://localhost:3000');
  console.log('Press CTRL-C to stop\n');
});

module.exports = app;
