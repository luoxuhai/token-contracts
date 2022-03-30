const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

global.web3 = new Web3(
  new HDWalletProvider(
    '6f0653b59289afcdb877430e8200b2dd35af51d4eba7c2316c36f7da2f62f888',
    'wss://rinkeby.infura.io/ws/v3/b7b864425ef044d8b219ef299a7c9e2c'
  )
);

exports.PORT = 8098;
