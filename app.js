const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');

const { PORT } = require('./config');
const { responseTime, error } = require('./middleware');
const { requestLogger } = require('./middleware/logger');
const { v1 } = require('./services');

const app = new Koa();

app.use(error);

app.use(responseTime);

// HTTP header security
app.use(helmet());

app.use(bodyParser());

app.use(requestLogger);

app.use(v1.routes());

app.use(router.routes());

app.use(router.allowedMethods());

app.listen(PORT);
