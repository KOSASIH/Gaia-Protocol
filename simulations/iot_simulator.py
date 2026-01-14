import random
import time

class IoTSimulator:
    def __init__(self, num_sensors=10):
        self.sensors = [f"sensor_{i}" for i in range(num_sensors)]
        self.data = {}

    def simulate_tracking(self):
        """Track resources in real-time."""
        for sensor in self.sensors:
            self.data[sensor] = {
                "water_level": random.uniform(0, 1000),  # Liters
                "energy_usage": random.uniform(0, 500),   # kWh
                "location": (random.uniform(-90, 90), random.uniform(-180, 180))  # Lat/Long
            }
        return self.data

    def get_digital_twin(self, sensor_id):
        """Return digital twin data."""
        return self.data.get(sensor_id, {})

# Example
sim = IoTSimulator()
while True:
    data = sim.simulate_tracking()
    print("IoT Data:", data)
    time.sleep(1)  # Real-time simulation
