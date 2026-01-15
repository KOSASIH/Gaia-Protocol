import requests
import json
import asyncio
import websockets
from simulations.quantum_ledger import QuantumLedger
from simulations.ai_optimizer import ResourceOptimizer
from simulations.iot_simulator import IoTSimulator
import hashlib
import time

class ChainlinkBridge:
    def __init__(self, chainlink_api_key, contract_address, oracle_address, ws_url="ws://localhost:3001"):
        self.api_key = chainlink_api_key
        self.contract = contract_address
        self.oracle = oracle_address
        self.ws_url = ws_url
        self.ledger = QuantumLedger()
        self.optimizer = ResourceOptimizer()
        self.simulator = IoTSimulator()
        self.consensus_oracles = ["chainlink", "pyth"]  # Multi-oracle
        self.merkle_root = None

    async def run_full_simulation(self, input_data):
        """Run integrated quantum/AI/IoT sim off-chain."""
        iot_data = await self.simulator.simulate_tracking()
        regions_data = [[d['data']['water_level'], d['data']['energy_usage'], d['data']['minerals_stock']] for d in iot_data.values()]
        allocations = self.optimizer.optimize_allocation(regions_data)
        planetary_data = {f"region_{i}": {"water": allocations[i][0], "energy": allocations[i][1], "minerals": allocations[i][2]} for i in range(len(allocations))}
        synced_ledgers, consensus = self.ledger.multi_node_sync(planetary_data)
        # Build Merkle tree for validation
        data_hashes = [hashlib.sha256(json.dumps(d).encode()).hexdigest() for d in synced_ledgers.values()]
        self.merkle_root = self.build_merkle_tree(data_hashes)
        return {"synced": synced_ledgers, "consensus": consensus, "allocations": allocations, "merkle_root": self.merkle_root}

    def build_merkle_tree(self, hashes):
        """Build Merkle root for data integrity."""
        if not hashes:
            return None
        while len(hashes) > 1:
            if len(hashes) % 2 == 1:
                hashes.append(hashes[-1])
            hashes = [hashlib.sha256((hashes[i] + hashes[i+1]).encode()).hexdigest() for i in range(0, len(hashes), 2)]
        return hashes[0]

    async def submit_to_oracles(self, sim_results):
        """Submit to multi-oracle consensus."""
        submissions = []
        for oracle in self.consensus_oracles:
            payload = {
                "api_key": self.api_key,
                "contract": self.contract,
                "oracle": self.oracle,
                "function": "updateAllocations",  # Custom contract function
                "args": json.dumps(sim_results["allocations"]),
                "merkle_proof": self.merkle_root
            }
            if oracle == "chainlink":
                response = requests.post("https://functions.chain.link/execute", json=payload)
            elif oracle == "pyth":
                response = requests.post("https://pyth.network/api/submit", json=payload)  # Placeholder
            submissions.append(response.json())
        # Consensus: Majority vote
        valid_submissions = [s for s in submissions if s.get("status") == "success"]
        if len(valid_submissions) > len(self.consensus_oracles) // 2:
            return {"consensus_result": "accepted", "details": valid_submissions}
        return {"consensus_result": "rejected"}

    async def stream_realtime_updates(self):
        """WebSocket streaming for real-time sim data."""
        async with websockets.connect(self.ws_url) as websocket:
            while True:
                sim_data = await self.run_full_simulation({})
                await websocket.send(json.dumps(sim_data))
                response = await websocket.recv()
                print(f"Contract Response: {response}")
                await asyncio.sleep(10)  # Real-time interval

    async def predictive_ai_oracle(self, query):
        """AI-powered predictive oracle using Chainlink."""
        payload = {
            "api_key": self.api_key,
            "function": "predictFutureAllocation",  # Off-chain AI
            "args": json.dumps({"query": query})
        }
        response = requests.post("https://functions.chain.link/execute", json=payload)
        return response.json()

# Example Usage (Runnable Standalone)
async def main():
    bridge = ChainlinkBridge("your_api_key", "0xYourContractAddress", "0xYourOracleAddress")
    
    # Run full sim
    results = await bridge.run_full_simulation({"water": 1000000})
    print("Simulation Results:", json.dumps(results, indent=2))
    
    # Submit to oracles
    consensus = await bridge.submit_to_oracles(results)
    print("Oracle Consensus:", consensus)
    
    # Predictive query
    prediction = await bridge.predictive_ai_oracle("What will water allocation be in 2065?")
    print("AI Prediction:", prediction)
    
    # Start streaming (comment out for demo)
    # await bridge.stream_realtime_updates()

if __name__ == "__main__":
    asyncio.run(main())
