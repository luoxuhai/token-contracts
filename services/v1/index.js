const Router = require('koa-router');
const contract = require('./contract/routes');
const account = require('./account/routes');
const pay = require('./pay/routes');

const v1 = new Router({
  prefix: '/v1',
});

v1.use(contract.routes());
v1.use(account.routes());
v1.use(pay.routes());

module.exports = v1;
