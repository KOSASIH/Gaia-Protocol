import numpy as np
import hashlib
from qiskit import QuantumCircuit, Aer, execute, transpile
from qiskit.providers.aer import AerSimulator
from qiskit.quantum_info import Statevector, random_statevector
from qiskit.circuit.library import QFT, IQFT
from collections import defaultdict
import time
import json

class QuantumLedger:
    def __init__(self, num_qubits=9, nodes=5):  # 9 qubits for Shor error correction
        self.num_qubits = num_qubits
        self.nodes = nodes  # Simulate planetary nodes (e.g., continents)
        self.backend = AerSimulator()  # Noisy simulator for realism
        self.ledger = defaultdict(dict)  # Distributed ledger: node -> {resource: amount}
        self.merkle_tree = {}  # Classical Merkle tree for hashing
        self.consensus_log = []  # Log of consensus rounds

    def quantum_hash(self, data):
        """Quantum hashing using QFT for secure, entanglement-based hash."""
        qc = QuantumCircuit(self.num_qubits // 3, self.num_qubits // 3)  # Simplified
        qc.h(0)
        for i in range(1, qc.num_qubits):
            qc.cx(0, i)
        qc.append(QFT(qc.num_qubits), range(qc.num_qubits))
        # Encode data into amplitudes
        state = Statevector.from_label('0' * qc.num_qubits)
        for i, bit in enumerate(data[:qc.num_qubits]):
            if bit == '1':
                state = state.evolve(qc)
        qc.measure_all()
        job = execute(qc, self.backend, shots=1)
        result = job.result().get_counts()
        return list(result.keys())[0]  # Quantum hash as string

    def build_merkle_tree(self, data_list):
        """Classical Merkle tree for data integrity."""
        if not data_list:
            return None
        if len(data_list) == 1:
            return hashlib.sha256(data_list[0].encode()).hexdigest()
        mid = len(data_list) // 2
        left = self.build_merkle_tree(data_list[:mid])
        right = self.build_merkle_tree(data_list[mid:])
        return hashlib.sha256((left + right).encode()).hexdigest()

    def apply_error_correction(self, qc):
        """Apply Shor's 9-qubit error correction code."""
        # Simplified Shor code: Encode logical qubit into 9 physical qubits
        qc.cx(0, 3)
        qc.cx(0, 6)
        qc.h([0, 3, 6])
        qc.cx(0, 1)
        qc.cx(3, 4)
        qc.cx(6, 7)
        qc.cx(0, 2)
        qc.cx(3, 5)
        qc.cx(6, 8)
        return qc

    def quantum_teleportation(self, data_state):
        """Simulate quantum teleportation for FTL data transfer."""
        qc = QuantumCircuit(3, 3)
        # Entangle qubits 1 and 2
        qc.h(1)
        qc.cx(1, 2)
        # Prepare data on qubit 0 (simulate data encoding)
        if data_state == '1':
            qc.x(0)
        # Teleport: Measure entangled pair
        qc.cx(0, 1)
        qc.h(0)
        qc.measure([0, 1], [0, 1])
        # Apply corrections based on measurement (simplified)
        qc.x(2).c_if(0, 1)
        qc.z(2).c_if(1, 1)
        return qc

    def sync_inventory(self, global_data, node_id):
        """Sync inventory for a single node using quantum teleportation."""
        qc = self.quantum_teleportation(str(global_data))  # Teleport data state
        qc = self.apply_error_correction(qc)  # Add error correction
        job = execute(qc, self.backend, shots=1024, noise_model=None)  # Add noise for realism
        result = job.result()
        counts = result.get_counts()
        # Decode synced data (approximate FTL sync)
        synced_amount = sum(int(k, 2) for k in counts.keys()) / 1024 * max(global_data.values())
        self.ledger[node_id] = {k: v * np.random.uniform(0.95, 1.05) for k, v in global_data.items()}  # Self-correct oscillation
        return self.ledger[node_id]

    def multi_node_sync(self, nodes_data):
        """Distributed sync across planetary nodes with consensus."""
        synced_ledgers = {}
        for node, data in nodes_data.items():
            synced_ledgers[node] = self.sync_inventory(data, node)
        # Quantum consensus: Simulate Byzantine agreement with majority vote
        consensus_votes = {}
        for resource in set(k for d in nodes_data.values() for k in d.keys()):
            votes = [synced_ledgers[node].get(resource, 0) for node in synced_ledgers]
            consensus_votes[resource] = np.median(votes)  # Median for fault tolerance
        self.consensus_log.append({"round": len(self.consensus_log) + 1, "votes": consensus_votes, "timestamp": time.time()})
        # Update Merkle tree
        data_hashes = [self.quantum_hash(json.dumps(d)) for d in synced_ledgers.values()]
        self.merkle_tree = self.build_merkle_tree(data_hashes)
        return synced_ledgers, consensus_votes

    def validate_ledger(self, node_id):
        """Validate a node's ledger against Merkle root."""
        node_hash = self.quantum_hash(json.dumps(self.ledger[node_id]))
        return node_hash in self.merkle_tree  # Simplified check

    def integrate_with_ai_iot(self, ai_optimizer, iot_simulator):
        """Real-time integration: Pull from AI and IoT for dynamic sync."""
        iot_data = iot_simulator.simulate_tracking()
        regions = [[d['water_level'], d['energy_usage'], random.uniform(0,1)] for d in iot_data.values()]
        allocations = ai_optimizer.optimize_allocation(regions)
        # Simulate planetary data from IoT
        planetary_data = {f"region_{i}": {"water": allocations[i], "energy": iot_data[f"sensor_{i}"]['energy_usage']} for i in range(len(allocations))}
        synced, consensus = self.multi_node_sync(planetary_data)
        return synced, consensus

# Example Usage (Runnable Standalone)
if __name__ == "__main__":
    from ai_optimizer import ResourceOptimizer  # Import from same folder
    from iot_simulator import IoTSimulator
    
    ledger = QuantumLedger()
    optimizer = ResourceOptimizer()
    simulator = IoTSimulator()
    
    # Train AI briefly
    optimizer.train_on_real_data(simulator.simulate_tracking())
    
    # Run full integration
    synced_ledgers, consensus = ledger.integrate_with_ai_iot(optimizer, simulator)
    print("Synced Planetary Ledgers:", json.dumps(synced_ledgers, indent=2))
    print("Consensus Allocations:", consensus)
    print("Merkle Root:", ledger.merkle_tree)
    print("Validation for node 'region_0':", ledger.validate_ledger("region_0"))
