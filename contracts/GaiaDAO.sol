// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract GaiaDAO is Ownable {
    ERC20 public governanceToken;  // Token for voting (e.g., GAIA token)
    mapping(address => uint256) public votes;
    mapping(bytes32 => Proposal) public proposals;
    uint256 public proposalCount;

    struct Proposal {
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        address targetContract;  // e.g., ResourceAllocator
        bytes data;  // Function call data
    }

    event ProposalCreated(uint256 id, string desc);
    event Voted(uint256 id, address voter, bool support);

    constructor(address _token) {
        governanceToken = ERC20(_token);
    }

    function createProposal(string memory desc, address target, bytes memory data) external onlyOwner {
        proposalCount++;
        proposals[keccak256(abi.encodePacked(proposalCount))] = Proposal(desc, 0, 0, false, target, data);
        emit ProposalCreated(proposalCount, desc);
    }

    function vote(uint256 id, bool support, uint256 amount) external {
        require(governanceToken.balanceOf(msg.sender) >= amount, "Insufficient tokens");
        governanceToken.transferFrom(msg.sender, address(this), amount);  // Lock tokens
        if (support) votes[keccak256(abi.encodePacked(id))].votesFor += amount;
        else votes[keccak256(abi.encodePacked(id))].votesAgainst += amount;
        emit Voted(id, msg.sender, support);
    }

    function executeProposal(uint256 id) external {
        Proposal storage p = proposals[keccak256(abi.encodePacked(id))];
        require(!p.executed && p.votesFor > p.votesAgainst, "Cannot execute");
        (bool success,) = p.targetContract.call(p.data);
        require(success, "Execution failed");
        p.executed = true;
    }
}
