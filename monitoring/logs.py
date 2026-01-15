import logging
import json
from datetime import datetime
from utils.dataHelpers import DataHelpers  # Import from utils

class LogAggregator:
    def __init__(self, log_file='monitoring/gaia_logs.json'):
        self.log_file = log_file
        logging.basicConfig(filename=log_file, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    def log_event(self, event_type, data):
        """Log planetary events with Merkle integrity."""
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': event_type,
            'data': data,
            'merkle_hash': DataHelpers.build_merkle_tree([json.dumps(data)])
        }
        logging.info(json.dumps(log_entry))
        print(f"Logged: {event_type}")

    def aggregate_anomalies(self):
        """Aggregate anomaly logs for alerting."""
        with open(self.log_file, 'r') as f:
            logs = [json.loads(line.split(' - INFO - ')[1]) for line in f if 'anomaly' in line.lower()]
        return logs

# Example
aggregator = LogAggregator()
aggregator.log_event('quantum_sync', {'latency': 2.5})
aggregator.log_event('iot_anomaly', {'sensor': 'sensor_1', 'score': 0.9})
print("Anomalies:", aggregator.aggregate_anomalies())
