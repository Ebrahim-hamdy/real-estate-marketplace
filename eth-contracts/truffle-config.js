// Allows us to use ES6 in our migrations and tests.
require("babel-register");
require("dotenv").config();

const HDWalletProvider = require("truffle-hdwallet-provider");

const METAMASK_SEED = process.env.METAMASK_SEED;
const INFURA_LINK = `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`;
console.log(METAMASK_SEED);

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },

    rinkeby: {
      provider: () => new HDWalletProvider(METAMASK_SEED, INFURA_LINK),
      network_id: "4",
      gas: 4500000,
      gasPrice: 10000000000
    }
  },

  compilers: {
    solc: {
      version: "0.5.2"
    }
  }
};
