pragma solidity >=0.4.21 <0.6.0;

import './ERC721Mintable.sol';

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier {
  function verifyTx(
    uint[2] memory a,
    uint[2] memory a_p,
    uint[2][2] memory b,
    uint[2] memory b_p,
    uint[2] memory c,
    uint[2] memory c_p,
    uint[2] memory h,
    uint[2] memory k,
    uint[2] memory input
  ) public returns (bool r);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is EbraContract {

  // TODO define a solutions struct that can hold an index & an address
  struct Solution {
    uint256 tokenId;
    address to;
  }

  SquareVerifier public verifier;

  // TODO define an array of the above struct
  mapping(bytes32 => Solution) solutions;

  // TODO Create an event to emit when a solution is added
  event SolutionAdded(address to, bytes32 key);

  constructor(address _verifiedAddress) public {
    verifier = SquareVerifier(_verifiedAddress);
  }

  // TODO Create a function to add the solutions to the array and emit the event
  function addSolution(bytes32 _key, uint256 _tokenId, address _to) internal {
    solutions[_key] = Solution({
      tokenId: _tokenId,
      to: _to
    });

    emit SolutionAdded(_to, _key);
  }

  // TODO Create a function to mint new NFT only after the solution has been verified
  //  - make sure the solution is unique (has not been used before)
  //  - make sure you handle metadata as well as tokenSuplly
  function mintNewNft(
    uint256 _tokenId, 
    address _to, 
    uint[2] memory _a,
    uint[2] memory _a_p,
    uint[2][2] memory _b,
    uint[2] memory _b_p,
    uint[2] memory _c,
    uint[2] memory _c_p,
    uint[2] memory _h,
    uint[2] memory _k,
    uint[2] memory _input
  ) public {
      require(verifier.verifyTx(
        _a,
        _a_p,
        _b,
        _b_p,
        _c,
        _c_p,
        _h,
        _k,
        _input
      ), "Invalid Verifier!");

      bytes32 solutionKey = keccak256(abi.encodePacked(
        _a, 
        _a_p,
        _b, 
        _b_p, 
        _c, 
        _c_p, 
        _h, 
        _k, 
        _input
      ));

      require(solutions[solutionKey].to == address(0), "Solution should be unique");

      addSolution(solutionKey, _tokenId, _to);

      super.mint(_to, _tokenId);
  }
}

























