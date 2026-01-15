#!/bin/bash
# Gaia Protocol Automation Workflow
# Runs full CI/CD-like process locally.

echo "Starting Gaia Automation Workflow..."

# Build and test
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed!"
  exit 1
fi

# Run sims
python simulations/quantum_ledger.py
python simulations/ai_optimizer.py

# Deploy
npx hardhat run scripts/deploy.js --network polygonMumbai

# Monitor
echo "Monitoring enabled. Check logs/monitoring/gaia_logs.json"

echo "Workflow Complete!"
