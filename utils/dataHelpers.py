import hashlib
import json
from typing import List, Dict

class DataHelpers:
    @staticmethod
    def build_merkle_tree(data_list: List[str]) -> str:
        """Build Merkle root from data list."""
        if not data_list:
            return ""
        hashes = [hashlib.sha256(d.encode()).hexdigest() for d in data_list]
        while len(hashes) > 1:
            if len(hashes) % 2 == 1:
                hashes.append(hashes[-1])
            hashes = [hashlib.sha256((hashes[i] + hashes[i+1]).encode()).hexdigest() for i in range(0, len(hashes), 2)]
        return hashes[0]

    @staticmethod
    def validate_merkle_proof(root: str, proof: List[str], leaf: str) -> bool:
        """Validate Merkle proof."""
        current = hashlib.sha256(leaf.encode()).hexdigest()
        for sibling in proof:
            current = hashlib.sha256((current + sibling).encode()).hexdigest()
        return current == root

    @staticmethod
    def normalize_sim_data(data: Dict) -> Dict:
        """Normalize sim outputs for contracts/oracles."""
        return {k: float(v) if isinstance(v, (int, float)) else str(v) for k, v in data.items()}

# Example
helpers = DataHelpers()
root = helpers.build_merkle_tree(["data1", "data2"])
print("Merkle Root:", root)
