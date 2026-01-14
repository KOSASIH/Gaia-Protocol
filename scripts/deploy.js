const { ethers } = require("hardhat");

async function main() {
  const GaiaDAO = await ethers.getContractFactory("GaiaDAO");
  const ResourceAllocator = await ethers.getContractFactory("ResourceAllocator");

  // Deploy with dummy addresses (replace with real token/oracle)
  const dao = await GaiaDAO.deploy("0xYourGovernanceTokenAddress");
  await dao.deployed();
  console.log("GaiaDAO deployed to:", dao.address);

  const allocator = await ResourceAllocator.deploy("0xYourChainlinkOracleAddress");
  await allocator.deployed();
  console.log("ResourceAllocator deployed to:", allocator.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
