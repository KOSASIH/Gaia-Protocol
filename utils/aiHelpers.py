import numpy as np
from stable_baselines3 import PPO
import json

class AIHelpers:
    @staticmethod
    def load_model(path: str) -> PPO:
        """Load trained AI model."""
        return PPO.load(path)

    @staticmethod
    def preprocess_for_ai(data: Dict) -> np.ndarray:
        """Preprocess data for AI input."""
        return np.array([data.get('water', 0), data.get('energy', 0), data.get('minerals', 0)])

    @staticmethod
    def postprocess_ai_output(output: np.ndarray) -> Dict:
        """Postprocess AI output for contracts."""
        return {"allocation": output.tolist(), "confidence": np.max(output)}

# Example
helpers = AIHelpers()
processed = helpers.preprocess_for_ai({"water": 1000, "energy": 500})
print("Processed Data:", processed)
