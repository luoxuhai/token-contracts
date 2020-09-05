const Router = require('koa-router');

const router = new Router({
  prefix: '/account',
});

router.get('/create', async (ctx) => {
  const account = web3.eth.accounts.create();

  ctx.body = {
    address: account.address,
    privateKey: account.privateKey,
  };
});

router.get('/privateKeyToAccount', async (ctx) => {
  const account = web3.eth.accounts.privateKeyToAccount(
    ctx.request.query.privateKey || ''
  );

  ctx.body = {
    address: account.address,
    privateKey: account.privateKey,
  };
});

router.get('/balance', async (ctx) => {
  try {
    const balance = await web3.eth.getBalance(ctx.request.query.address);

    ctx.body = {
      balance: web3.utils.fromWei(balance, 'ether'),
    };
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

module.exports = router;
