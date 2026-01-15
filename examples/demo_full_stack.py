#!/usr/bin/env python3
"""
Gaia Protocol Full Stack Demo
Runs a complete planetary simulation: quantum sync -> AI allocation -> IoT tracking -> Oracle feed -> Contract update.
Requires Docker Compose running.
"""
import subprocess
import time
import json
from simulations.quantum_ledger import QuantumLedger
from simulations.ai_optimizer import ResourceOptimizer
from simulations.iot_simulator import IoTSimulator
from oracles.chainlink_bridge import ChainlinkBridge

def run_demo():
    print("Starting Gaia Protocol Full Stack Demo...")

    # Step 1: Run Simulations
    print("1. Running Quantum Ledger Sync...")
    ledger = QuantumLedger()
    planetary_data = {"earth": {"water": 1000000, "energy": 500000}, "mars": {"minerals": 200000}}
    synced, consensus = ledger.multi_node_sync(planetary_data)
    print("Synced Data:", json.dumps(synced, indent=2))

    print("2. Optimizing with AI...")
    optimizer = ResourceOptimizer()
    optimizer.train(total_timesteps=1000)  # Quick train
    regions_data = [[1000, 500, 200], [800, 400, 150]]  # Sample regions
    allocations = optimizer.optimize_allocation(regions_data)
    print("AI Allocations:", allocations)

    print("3. Simulating IoT Tracking...")
    simulator = IoTSimulator(num_sensors=5)
    iot_data = asyncio.run(simulator.simulate_tracking())
    print("IoT Data Sample:", list(iot_data.keys())[:3])

    # Step 2: Bridge to Oracles
    print("4. Feeding to Oracles...")
    bridge = ChainlinkBridge("demo_key", "0xDemoContract", "0xDemoOracle")
    sim_results = asyncio.run(bridge.run_full_simulation(planetary_data))
    consensus_result = asyncio.run(bridge.submit_to_oracles(sim_results))
    print("Oracle Consensus:", consensus_result)

    # Step 3: Interact with Contracts (via subprocess to avoid imports)
    print("5. Updating Contracts...")
    subprocess.run(["npx", "hardhat", "run", "scripts/interact.js", "--network", "polygonMumbai"], check=True)

    print("Demo Complete! Check logs for homeostasis.")

if __name__ == "__main__":
    run_demo()
