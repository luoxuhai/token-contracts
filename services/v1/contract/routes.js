const Router = require('koa-router');
const solc = require('solc');
const fs = require('fs');
const path = require('path');

const contractSource = fs
  .readFileSync(path.join(__dirname, 'ERC20.sol'))
  .toString();

function compileContract(content, contractName = 'Token') {
  const input = JSON.stringify({
    language: 'Solidity',
    sources: {
      'ERC20.sol': {
        content,
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        '*': {
          '*': ['evm.bytecode.object', 'abi'],
        },
      },
    },
  });

  const output = JSON.parse(solc.compile(input));
  const ERC20Json = {
    abi: output.contracts['ERC20.sol'][contractName].abi,
    bytecode: output.contracts['ERC20.sol'][contractName].evm.bytecode.object,
  };

  return ERC20Json;
}

const abi = compileContract(contractSource).abi;
const bytecode = compileContract(contractSource).bytecode;

const router = new Router({
  prefix: '/contract',
});

router.post('/deploy', async (ctx) => {
  const {
    initialSupply,
    tokenName,
    tokenSymbol,
    tokenOwner,
    tokenDecimals = 18,
    userId,
  } = ctx.request.body;

  if (!(await redis.get(userId))) {
    ctx.throw(500, 'unpaid');
  }

  let transactionHash;
  const accounts = await web3.eth.getAccounts();

  const contract = await new web3.eth.Contract(abi)
    .deploy({
      data: '0x' + bytecode,
      arguments: [
        tokenName,
        tokenSymbol,
        initialSupply,
        tokenOwner,
        tokenDecimals,
      ],
    })
    .send({
      from: accounts[0],
      gas: 1000000,
      gasPrice: web3.utils.toWei('100', 'gwei'),
    })
    .on('transactionHash', (_transactionHash) => {
      transactionHash = _transactionHash;
    });
  redis.del(userId);
  ctx.body = {
    contractAddress: contract.options.address,
    transactionHash,
    contractSourceCode: contractSource.replace(
      'Token',
      isNaN(Number(tokenSymbol[0])) ? tokenSymbol : `_${tokenSymbol}`
    ),
  };
});

router.post('/call', async (ctx) => {
  const { method, params = [], from, contractAddress } = ctx.request.body;

  const result = await new web3.eth.Contract(abi, contractAddress).methods[
    method
  ](...params).call({ from });

  ctx.body = {
    result,
  };
});

module.exports = router;
