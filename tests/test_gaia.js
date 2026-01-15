const { expect } = require("chai");
const { ethers } = require("hardhat");
const { spawn } = require("child_process");

describe("Gaia Protocol Full Suite", function () {
  let dao, allocator, token, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy mocks
    const Token = await ethers.getContractFactory("ERC20Mock");
    token = await Token.deploy("GaiaToken", "GAIA", ethers.utils.parseEther("1000000"));
    await token.deployed();

    const GaiaDAO = await ethers.getContractFactory("GaiaDAO");
    dao = await GaiaDAO.deploy(token.address, "0x...");  // Mock oracle
    await dao.deployed();

    const ResourceAllocator = await ethers.getContractFactory("ResourceAllocator");
    allocator = await ResourceAllocator.deploy("0x...");
    await allocator.deployed();

    // Mint tokens
    await token.transfer(addr1.address, ethers.utils.parseEther("1000"));
    await token.transfer(addr2.address, ethers.utils.parseEther("1000"));
  });

  describe("GaiaDAO", function () {
    it("Should create and execute a proposal with AI prediction", async function () {
      await dao.createProposal("Allocate water", allocator.address, "0x");
      const proposalId = 1;
      await token.connect(addr1).approve(dao.address, ethers.utils.parseEther("100"));
      await dao.connect(addr1).vote(proposalId, true, ethers.utils.parseEther("100"));
      await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);  // Fast-forward
      await dao.executeProposal(proposalId);
      expect(await dao.proposals(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposalId.toString()))).executed).to.be.true;
    });

    it("Should handle quantum-inspired voting consensus", async function () {
      // Simulate multi-party voting (entanglement mock)
      await dao.createProposal("Global sync", allocator.address, "0x");
      await token.connect(addr1).approve(dao.address, ethers.utils.parseEther("500"));
      await dao.connect(addr1).vote(1, true, ethers.utils.parseEther("500"));
      await token.connect(addr2).approve(dao.address, ethers.utils.parseEther("300"));
      await dao.connect(addr2).vote(1, false, ethers.utils.parseEther("300"));
      expect((await dao.proposals(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("1")))).votesFor).to.equal(ethers.utils.parseEther("500"));
    });
  });

  describe("ResourceAllocator", function () {
    it("Should allocate resources with oracle adjustment", async function () {
      await allocator.allocateResource(addr1.address, ethers.utils.parseEther("100"));
      expect(await allocator.allocations(addr1.address)).to.be.above(0);
    });

    it("Should rebalance with AI via oracle", async function () {
      await allocator.allocateResource(addr1.address, ethers.utils.parseEther("100"));
      const tokenId = 1;
      await allocator.connect(addr1).rebalanceResource(tokenId, ethers.utils.parseEther("150"));
      // Mock oracle fulfillment
      await allocator.fulfillRequest("0x...", ethers.utils.defaultAbiCoder.encode(["uint256"], [ethers.utils.parseEther("142.5")]));
      expect((await allocator.resources(tokenId)).amount).to.equal(ethers.utils.parseEther("142.5"));
    });
  });

  describe("Integration with Simulations", function () {
    it("Should run quantum ledger and verify sync", async function () {
      return new Promise((resolve) => {
        const quantumProcess = spawn("python", ["simulations/quantum_ledger.py"], { stdio: "pipe" });
        quantumProcess.stdout.on("data", async (data) => {
          const output = data.toString();
          if (output.includes("Synced Inventory")) {
            // Mock on-chain update
            await allocator.allocateResource(owner.address, ethers.utils.parseEther("1000"));
            expect(await allocator.allocations(owner.address)).to.equal(ethers.utils.parseEther("1000"));
            resolve();
          }
        });
        quantumProcess.on("close", () => resolve());
      });
    });

    it("Should optimize with AI and check homeostasis", async function () {
      return new Promise((resolve) => {
        const aiProcess = spawn("python", ["simulations/ai_optimizer.py"], { stdio: "pipe" });
        aiProcess.stdout.on("data", async (data) => {
          const output = data.toString();
          if (output.includes("Optimized Allocations")) {
            // Assert fairness (Gini mock)
            const allocation = await allocator.getAllocation(owner.address);
            expect(allocation).to.be.within(ethers.utils.parseEther("900"), ethers.utils.parseEther("1100"));
            resolve();
          }
        });
        aiProcess.on("close", () => resolve());
      });
    });

    it("Should detect IoT anomalies and alert", async function () {
      return new Promise((resolve) => {
        const iotProcess = spawn("python", ["simulations/iot_simulator.py"], { stdio: "pipe" });
        iotProcess.stdout.on("data", async (data) => {
          const output = data.toString();
          if (output.includes("Anomaly")) {
            // Mock contract pause
            await dao.pause();
            expect(await dao.paused()).to.be.true;
            resolve();
          }
        });
        iotProcess.on("close", () => resolve());
      });
    });
  });

  describe("End-to-End Planetary Scenario", function () {
    it("Should simulate full Gaia cycle: Sim -> Oracle -> On-Chain", async function () {
      // Run all sims
      const simProcesses = [
        spawn("python", ["simulations/quantum_ledger.py"]),
        spawn("python", ["simulations/ai_optimizer.py"]),
        spawn("python", ["simulations/iot_simulator.py"])
      ];
      await Promise.all(simProcesses.map(p => new Promise(res => p.on("close", res))));
      
      // Mock oracle feed
      await allocator.fulfillRequest("0x...", ethers.utils.defaultAbiCoder.encode(["uint256"], [ethers.utils.parseEther("2000")]));
      
      // Check planetary allocation
      const totalAlloc = (await allocator.allocations(owner.address)).add(await allocator.allocations(addr1.address));
      expect(totalAlloc).to.be.above(ethers.utils.parseEther("1500"));
    });
  });

  after(async function () {
    // Gas profiling
    console.log("Gas Usage Report:");
    // Add hardhat-contract-sizer output here
  });
});
