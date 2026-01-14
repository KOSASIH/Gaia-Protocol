const { expect } = require("chai");

describe("GaiaDAO", function () {
  it("Should create and execute a proposal", async function () {
    const GaiaDAO = await ethers.getContractFactory("GaiaDAO");
    const dao = await GaiaDAO.deploy("0x...");  // Mock token
    await dao.deployed();

    await dao.createProposal("Allocate water", "0x...", "0x");
    // Add voting logic here
    expect(await dao.proposalCount()).to.equal(1);
  });
});
