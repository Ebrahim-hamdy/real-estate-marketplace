const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
require("dotenv").config();

const contract = require("../eth-contracts/build/contracts/SolnSquareVerifier");
const ABI = contract.abi;

const MNEMONIC = process.env.METAMASK_SEED;
const INFURA_KEY = process.env.INFURA_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;

const provider = new HDWalletProvider(
  MNEMONIC,
  `https://rinkeby.infura.io/v3/${INFURA_KEY}`
);
const web3Instance = new web3(provider);

const proofs = [
  require("./proofs/proof-1"),
  require("./proofs/proof-2"),
  require("./proofs/proof-3"),
  require("./proofs/proof-4"),
  require("./proofs/prrof-5")
];

(async function() {
  if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !CONTRACT_ADDRESS) {
    console.log("please enter all fields");
    return;
  }
  this.accounts = await web3Instance.eth.getAccounts();

  const contract = new web3Instance.eth.Contract(ABI, CONTRACT_ADDRESS, {
    gasLimit: "1000000"
  });

  proofs.forEach(async function(proof, index) {
    try {
      await contract.methods
        .mintNewNft(
          index,
          OWNER_ADDRESS,
          proof.proof.A,
          proof.proof.A_p,
          proof.proof.B,
          proof.proof.B_p,
          proof.proof.C,
          proof.proof.C_p,
          proof.proof.H,
          proof.proof.K,
          proof.input
        )
        .send({
          from: OWNER_ADDRESS,
          gas: 3000000
        });
    } catch (error) {
      console.log(error.toString());
    }
  });
})();
