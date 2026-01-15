const { ethers, upgrades } = require('hardhat');

async function migrate() {
  const GaiaDAO = await ethers.getContractFactory('GaiaDAO');
  const upgraded = await upgrades.upgradeProxy('0xYourProxyAddress', GaiaDAO);  // Existing proxy
  console.log('Upgraded to:', upgraded.address);
}

migrate().catch(console.error);
