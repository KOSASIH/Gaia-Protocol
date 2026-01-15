const { ethers } = require("hardhat");
const readline = require("readline");
const { spawn } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  const [signer] = await ethers.getSigners();
  const daoAddress = "0x...";  // Set deployed address
  const allocatorAddress = "0x...";
  const dao = await ethers.getContractAt("GaiaDAO", daoAddress, signer);
  const allocator = await ethers.getContractAt("ResourceAllocator", allocatorAddress, signer);

  console.log("Gaia Protocol Interactive CLI");

  function prompt() {
    rl.question("Command (vote, allocate, run-sim, monitor, exit): ", async (cmd) => {
      switch (cmd) {
        case "vote":
          rl.question("Proposal ID, Support (true/false), Amount: ", async (input) => {
            const [id, support, amount] = input.split(",");
            await dao.vote(id, support === "true", ethers.utils.parseEther(amount));
            console.log("Voted.");
            prompt();
          });
          break;
        case "allocate":
          rl.question("Region Address, Amount: ", async (input) => {
            const [region, amount] = input.split(",");
            await allocator.allocateResource(region, ethers.utils.parseEther(amount));
            console.log("Allocated.");
            prompt();
          });
          break;
        case "run-sim":
          console.log("Running Simulations...");
          const simProcess = spawn("python", ["simulations/ai_optimizer.py"], { stdio: "inherit" });
          simProcess.on("close", () => {
            console.log("Sim complete. Feeding to Oracle...");
            // Feed to Chainlink (add logic)
            prompt();
          });
          break;
        case "monitor":
          setInterval(async () => {
            const allocation = await allocator.getAllocation(signer.address);
            console.log("Current Allocation:", ethers.utils.formatEther(allocation));
            // Check anomalies from IoT
            const iotProcess = spawn("python", ["-c", "from iot_simulator import IoTSimulator; sim=IoTSimulator(); print(sim.simulate_tracking())"], { stdio: "pipe" });
            iotProcess.stdout.on("data", (data) => console.log("IoT Alert:", data.toString()));
          }, 5000);
          prompt();
          break;
        case "exit":
          rl.close();
          break;
        default:
          console.log("Invalid command.");
          prompt();
      }
    });
  }
  prompt();
}

main().catch(console.error);
