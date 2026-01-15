import numpy as np
import pandas as pd
import gym
from gym import spaces
import requests
from stable_baselines3 import PPO
from stable_baselines3.common.env_util import make_vec_env
from stable_baselines3.common.callbacks import EvalCallback
import random
import json
import time

class PlanetaryResourceEnv(gym.Env):
    """Custom RL environment simulating planetary resource allocation."""
    def __init__(self, num_regions=10, resources=['water', 'energy', 'minerals']):
        super().__init__()
        self.num_regions = num_regions
        self.resources = resources
        self.state = self._init_state()  # {region: {resource: amount}}
        self.action_space = spaces.Box(low=0, high=1, shape=(num_regions * len(resources),), dtype=np.float32)  # Allocation ratios
        self.observation_space = spaces.Box(low=0, high=1e6, shape=(num_regions * len(resources),), dtype=np.float32)
        self.steps = 0
        self.max_steps = 1000

    def _init_state(self):
        return {f"region_{i}": {r: random.uniform(1000, 10000) for r in self.resources} for i in range(self.num_regions)}

    def _get_obs(self):
        return np.array([self.state[r][res] for r in self.state for res in self.resources])

    def step(self, action):
        # Decode action into allocations
        allocations = action.reshape((self.num_regions, len(self.resources)))
        total_available = {r: sum(self.state[reg][r] for reg in self.state) for r in self.resources}
        rewards = 0
        for i, reg in enumerate(self.state):
            for j, res in enumerate(self.resources):
                allocated = allocations[i][j] * total_available[res]
                self.state[reg][res] = max(0, self.state[reg][res] + allocated - random.uniform(500, 1500))  # Simulate usage/demand
        # Reward: Balance (minimize variance) + sustainability (penalize overuse)
        variances = [np.var([self.state[r][res] for r in self.state]) for res in self.resources]
        reward_balance = -sum(variances)  # Negative variance for balance
        reward_sustain = -sum(1 for r in self.resources if total_available[r] < 5000) * 100  # Penalty for shortages
        rewards = reward_balance + reward_sustain
        self.steps += 1
        done = self.steps >= self.max_steps
        return self._get_obs(), rewards, done, {}

    def reset(self):
        self.state = self._init_state()
        self.steps = 0
        return self._get_obs()

class ResourceOptimizer:
    def __init__(self, num_regions=10, model_path="ppo_gaia.zip"):
        self.num_regions = num_regions
        self.env = make_vec_env(lambda: PlanetaryResourceEnv(num_regions), n_envs=4)  # Vectorized for speed
        self.model = PPO("MlpPolicy", self.env, verbose=1, learning_rate=0.0003, n_steps=2048)
        self.model_path = model_path
        self.fairness_threshold = 0.3  # Gini coefficient limit for equity

    def train(self, total_timesteps=10000, real_data_augmentation=True):
        """Train RL model with optional real data."""
        if real_data_augmentation:
            self._augment_with_real_data()
        eval_callback = EvalCallback(self.env, best_model_save_path="./logs/", log_path="./logs/", eval_freq=1000)
        self.model.learn(total_timesteps=total_timesteps, callback=eval_callback)
        self.model.save(self.model_path)

    def _augment_with_real_data(self):
        """Augment training with real-world data (e.g., weather for water needs)."""
        try:
            # Example: Fetch weather data (replace with API key)
            response = requests.get("https://api.openweathermap.org/data/2.5/weather?q=London&appid=your_api_key")
            data = response.json()
            temp = data['main']['temp']  # Simulate demand based on temp
            # Adjust env dynamics (simplified)
            self.env.env_fns[0]().state['region_0']['water'] *= (1 + (temp - 273) / 100)  # Higher temp = more demand
        except:
            print("Real data fetch failed; using synthetic.")

    def optimize_allocation(self, regions_data):
        """Predict allocations using trained model."""
        obs = np.array([d for sublist in regions_data for d in sublist])  # Flatten
        action, _ = self.model.predict(obs, deterministic=True)
        allocations = action.reshape((self.num_regions, len(PlanetaryResourceEnv().resources)))
        # Apply fairness: Adjust for Gini
        gini = self._calculate_gini(allocations.flatten())
        if gini > self.fairness_threshold:
            allocations = self._redistribute_for_fairness(allocations)
        return allocations.tolist()

    def _calculate_gini(self, array):
        """Calculate Gini coefficient for fairness."""
        array = np.sort(array)
        n = len(array)
        cumsum = np.cumsum(array)
        return (n + 1 - 2 * np.sum(cumsum) / cumsum[-1]) / n

    def _redistribute_for_fairness(self, allocations):
        """Self-correct for equity."""
        flat = allocations.flatten()
        mean = np.mean(flat)
        return np.clip(flat + (mean - flat) * 0.1, 0, None).reshape(allocations.shape)  # Dampen extremes

    def simulate_homeostasis(self, steps=100):
        """Simulate self-correcting oscillations."""
        obs = self.env.reset()
        history = []
        for _ in range(steps):
            action, _ = self.model.predict(obs)
            obs, reward, done, _ = self.env.step(action)
            history.append({"step": _, "reward": reward, "obs": obs.tolist()})
            if done:
                break
        return history

    def integrate_with_quantum_iot(self, quantum_ledger, iot_simulator):
        """Full integration: Sync with quantum ledger and IoT for planetary optimization."""
        iot_data = iot_simulator.simulate_tracking()
        regions_data = [[d['water_level'], d['energy_usage'], random.uniform(0, 1000)] for d in iot_data.values()]
        allocations = self.optimize_allocation(regions_data)
        # Simulate planetary data
        planetary_data = {f"region_{i}": {"water": allocations[i][0], "energy": allocations[i][1], "minerals": allocations[i][2]} for i in range(len(allocations))}
        synced_ledgers, consensus = quantum_ledger.multi_node_sync(planetary_data)
        return synced_ledgers, consensus, allocations

# Example Usage (Runnable Standalone)
if __name__ == "__main__":
    from quantum_ledger import QuantumLedger  # Import from same folder
    from iot_simulator import IoTSimulator
    
    optimizer = ResourceOptimizer()
    ledger = QuantumLedger()
    simulator = IoTSimulator()
    
    # Train model (short for demo; run longer for better results)
    optimizer.train(total_timesteps=5000)
    
    # Run integration
    synced, consensus, allocs = optimizer.integrate_with_quantum_iot(ledger, simulator)
    print("Optimized Allocations:", json.dumps(allocs, indent=2))
    print("Synced Ledgers:", json.dumps(synced, indent=2))
    print("Consensus:", consensus)
    
    # Simulate homeostasis
    history = optimizer.simulate_homeostasis(50)
    print("Homeostasis History (Sample):", history[:5])
