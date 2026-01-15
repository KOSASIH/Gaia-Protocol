const express = require('express');
const promClient = require('prom-client');  // npm install prom-client
const { ethers } = require('ethers');
const LoggerUtils = require('../utils/logger');

const app = express();
const register = new promClient.Registry();

// Custom Metrics
const quantumSyncLatency = new promClient.Gauge({
  name: 'gaia_quantum_sync_latency',
  help: 'Latency of quantum ledger sync in seconds'
});

const aiAllocationVariance = new promClient.Gauge({
  name: 'gaia_ai_allocation_variance',
  help: 'Variance in AI resource allocations'
});

const iotAnomalyScore = new promClient.Gauge({
  name: 'gaia_iot_anomaly_score',
  help: 'IoT anomaly detection score'
});

const contractGasUsed = new promClient.Counter({
  name: 'gaia_contract_gas_used',
  help: 'Total gas used by contracts'
});

register.registerMetric(quantumSyncLatency);
register.registerMetric(aiAllocationVariance);
register.registerMetric(iotAnomalyScore);
register.registerMetric(contractGasUsed);

// Update metrics from sims/contracts
async function updateMetrics() {
  // Simulate fetching from sims
  quantumSyncLatency.set(Math.random() * 5);
  aiAllocationVariance.set(Math.random() * 0.3);
  iotAnomalyScore.set(Math.random() * 1);
  contractGasUsed.inc(Math.random() * 1000);
  LoggerUtils.logInfo('Metrics updated');
}

setInterval(updateMetrics, 15000);  // Every 15s

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(9090, () => {
  console.log('Metrics server on port 9090');
});
