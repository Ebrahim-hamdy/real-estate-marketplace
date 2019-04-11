const data = require("../../zokrates/code/square/proof.json");
const proof = data.proof;
const input = data.input;

var SquareVerifier = artifacts.require("Verifier");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

contract("SolnSquareVerifier", accounts => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const account_three = accounts[2];

  describe("check approvals", function() {
    beforeEach(async function() {
      const square_verifier = await SquareVerifier.new({ from: account_one });
      this.contract = await SolnSquareVerifier.new(square_verifier.address, {
        from: account_one
      });
    });

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it("ERC721 token can be minted for contract", async function() {
      await this.contract.mintNewNft(
        0,
        account_one,
        proof.A,
        proof.A_p,
        proof.B,
        proof.B_p,
        proof.C,
        proof.C_p,
        proof.H,
        proof.K,
        input,
        { from: account_one }
      );
    });

    // Test that a new solution cannot be added if the proof was used previously
    it("Token can't be minted for contract with same solution", async function() {
      let isMinted = false;

      await this.contract.mintNewNft(
        0,
        account_one,
        proof.A,
        proof.A_p,
        proof.B,
        proof.B_p,
        proof.C,
        proof.C_p,
        proof.H,
        proof.K,
        input,
        { from: account_one }
      );

      try {
        await this.contract.mintNewNft(
          0,
          account_one,
          proof.A,
          proof.A_p,
          proof.B,
          proof.B_p,
          proof.C,
          proof.C_p,
          proof.H,
          proof.K,
          input,
          { from: account_one }
        );
      } catch (error) {
        isMinted = true;
      }

      assert.equal(
        isMinted,
        true,
        "New solution cannot be added if the proof was used previously"
      );
    });
  });
});
