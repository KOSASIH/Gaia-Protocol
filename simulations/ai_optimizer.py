import tensorflow as tf
import numpy as np
import pandas as pd

class ResourceOptimizer:
    def __init__(self):
        self.model = self.build_model()

    def build_model(self):
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(64, activation='relu', input_shape=(3,)),  # Inputs: population, need, current stock
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dense(1, activation='sigmoid')  # Output: allocation priority (0-1)
        ])
        model.compile(optimizer='adam', loss='mse')
        return model

    def train(self, data):
        # Sample training data: [population, need_level, stock] -> priority
        X = np.array([[1000, 0.8, 500], [2000, 0.5, 1000], [500, 0.9, 200]])
        y = np.array([0.9, 0.6, 0.95])  # Priorities
        self.model.fit(X, y, epochs=10, verbose=0)

    def optimize_allocation(self, regions_data):
        predictions = self.model.predict(np.array(regions_data))
        # Self-correct: Redistribute based on predictions
        total_allocation = 10000  # Total units
        allocations = [total_allocation * p[0] for p in predictions]
        return allocations

# Example
optimizer = ResourceOptimizer()
optimizer.train([])  # Train with dummy data
regions = [[1500, 0.7, 600], [800, 0.4, 800]]  # [pop, need, stock]
allocs = optimizer.optimize_allocation(regions)
print("Optimized Allocations:", allocs)
