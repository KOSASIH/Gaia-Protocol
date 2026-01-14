require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  networks: {
    polygonMumbai: {
      url: "https://rpc-mumbai.maticvigil.com",  // Polygon Mumbai RPC
      accounts: [process.env.PRIVATE_KEY],  // Add your wallet private key to .env
    },
  },
};
