// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ResourceAllocator {
    AggregatorV3Interface internal waterLevelOracle;  // Chainlink feed for water data
    mapping(address => uint256) public allocations;  // e.g., water units per region

    constructor(address _oracle) {
        waterLevelOracle = AggregatorV3Interface(_oracle);
    }

    function getLatestWaterLevel() public view returns (int256) {
        (, int256 price,,,) = waterLevelOracle.latestRoundData();
        return price;  // Simulated water level (in liters or units)
    }

    function allocateResource(address region, uint256 amount) external {
        // In production, call AI oracle for prediction
        // For now, simple logic: allocate based on water level
        int256 level = getLatestWaterLevel();
        if (level < 500000) {  // Low water threshold
            allocations[region] += amount;
        }
    }

    function getAllocation(address region) external view returns (uint256) {
        return allocations[region];
    }
}
