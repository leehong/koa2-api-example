import Koa from 'koa';
import session from 'koa-generic-session';
import convert from 'koa-convert';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import methodOverride from 'koa-methodoverride';
import logger from 'koa-logger';

import config from '../config/config';
import router from './routes';
import koaRedis from 'koa-redis';
import models from './models';
import middlewares from './middlewares';
import cacheMiddle from './middlewares/cache';

//set redis for use session
const redisStore = koaRedis({
  url: config.redisUrl
});

const app = new Koa();

// set app session key
app.keys = [config.secretKey];

//convert  module to promise middleware
app.use(convert(session({
  store: redisStore,
  prefix: 'koa2-example-api:sess',
  key: 'koa2-example-api.sid'
})));

// load cache middlevare
app.use(cacheMiddle());

app.use(bodyParser());

//
app.use(methodOverride((req, _res) => {
  if (req.body && (typeof req.body === 'object') && ('_method' in req.body)){
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(convert(json()));
app.use(convert(logger()));

app.use(middlewares.catchError);

app.use(router.routes(), router.allowedMethods());

if (process.argv[2] && process.argv[2][0] == 'c') {
  const repl = require('repl');
  global.models = models;
  repl.start({
    prompt: '> ',
    useGlobal: true,
  }).on('exit', () => {process.exit(); });
} else {
  app.listen(config.port);
}

export default app;
