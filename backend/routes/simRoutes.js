const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

// Get all sim data
router.get('/all', async (req, res) => {
  const sims = ['quantum_ledger.py', 'ai_optimizer.py', 'iot_simulator.py'];
  const results = {};
  for (const sim of sims) {
    results[sim] = await runSim(sim);
  }
  res.json(results);
});

// Run specific sim
router.post('/run/:sim', (req, res) => {
  const { sim } = req.params;
  const process = spawn('python', [`simulations/${sim}`]);
  let output = '';
  process.stdout.on('data', (data) => output += data);
  process.on('close', () => res.json({ output }));
});

async function runSim(script) {
  return new Promise((resolve) => {
    const process = spawn('python', [`simulations/${script}`]);
    let data = '';
    process.stdout.on('data', (chunk) => data += chunk);
    process.on('close', () => resolve(data));
  });
}

module.exports = router;
