# Gaia Protocol Setup Tutorial

Welcome to Gaia Protocol! This tutorial guides you through setting up the full "GodHead Nexus level" stack for planetary resource management. By the end, you'll have a running DAO simulating 2065's Perfect Allocation—quantum-synced, AI-optimized, and IoT-tracked. This is deployable today, scalable to global homeostasis.

## Prerequisites
- **Hardware/Software**:
  - Docker & Docker Compose (for containerized setup).
  - Node.js 16+ (for contracts, frontend, backend).
  - Python 3.8+ (for simulations and oracles).
  - Git (for cloning the repo).
  - MetaMask or similar wallet (for Polygon interactions).
- **Accounts/APIs**:
  - Polygon Mumbai testnet account (faucet: https://faucet.polygon.technology/).
  - Chainlink API key (sign up at https://chain.link/).
  - OpenAI API key (for AI chat; optional but recommended).
  - OpenWeatherMap API key (for real IoT data augmentation).
- **Knowledge**: Basic command-line, JavaScript/Python. No blockchain experience needed—we guide you!

## Step 1: Clone and Initial Setup
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/KOSASIH/Gaia-Protocol.git
   cd Gaia-Protocol
   ```

2. **Install Global Dependencies**:
   ```bash
   npm install -g hardhat  # For contract development
   pip install qiskit stable-baselines3  # For quantum/AI sims
   ```

3. **Install Project Dependencies**:
   - Root: `npm install` (for contracts/scripts).
   - Frontend: `cd frontend && npm install`.
   - Backend: `cd ../backend && npm install`.
   - Sims: `pip install -r requirements.txt`.

4. **Configure Environment**:
   - Copy `config/.env.template` to `.env` in the root.
   - Fill in secrets:
     ```
     PRIVATE_KEY=your_polygon_private_key
     CHAINLINK_API_KEY=your_chainlink_key
     OPENAI_API_KEY=your_openai_key
     OPENWEATHER_API_KEY=your_weather_key
     JWT_SECRET=your_random_secret
     ```
   - **Security Tip**: Never commit `.env` to Git. Use encrypted vaults for production.

## Step 2: Run Simulations (Core Logic)
Gaia starts with off-chain simulations—quantum entanglement for FTL sync, AI for homeostasis, IoT for tracking.

1. **Test Quantum Ledger**:
   ```bash
   python simulations/quantum_ledger.py
   ```
   - Output: Synced planetary inventory with consensus. Simulates faster-than-light data transfer.

2. **Train AI Optimizer**:
   ```bash
   python simulations/ai_optimizer.py
   ```
   - Output: RL-trained allocations for resource balance. Watch for self-correcting oscillations.

3. **Simulate IoT**:
   ```bash
   python simulations/iot_simulator.py
   ```
   - Output: Real-time digital twin data with anomaly detection. Streams sensor readings.

4. **Run Full Integration**:
   ```bash
   python examples/demo_full_stack.py
   ```
   - Combines all sims; outputs end-to-end planetary data.

**Troubleshooting**:
- **Import Errors**: Ensure `PYTHONPATH` includes repo root.
- **Qiskit Issues**: Install via `pip install qiskit-aer` for simulator.
- **Performance**: Sims run on CPU; GPU optional for AI training.

## Step 3: Deploy Contracts (On-Chain Governance)
Contracts handle DAO voting, resource allocation, and oracle feeds on Polygon.

1. **Compile and Test**:
   ```bash
   npx hardhat compile
   npm test  # Runs unit/integration tests
   ```

2. **Deploy to Testnet**:
   ```bash
   npx hardhat run scripts/deploy.js --network polygonMumbai
   ```
   - Output: Contract addresses (e.g., GaiaDAO, ResourceAllocator). Note them for frontend/backend.

3. **Interact via CLI**:
   ```bash
   npx hardhat run scripts/interact.js --network polygonMumbai
   ```
   - Commands: `vote`, `allocate`, `run-sim` (feeds sims to contracts).

**Troubleshooting**:
- **Gas Errors**: Fund wallet with MATIC from faucet.
- **Network Issues**: Check `hardhat.config.js` for RPC URLs.
- **Verification**: Run `npx hardhat verify <address> --network polygonMumbai` for PolygonScan.

## Step 4: Launch Frontend (User Interface)
The React app visualizes planetary data with 3D maps, voting, and AI chat.

1. **Start App**:
   ```bash
   cd frontend
   npm start
   ```
   - Opens at http://localhost:3000. Connect MetaMask to Polygon Mumbai.

2. **Features**:
   - **3D Globe**: View resource allocations.
   - **Vote Form**: Propose/execute DAO actions.
   - **Dashboard**: Charts from sim data.
   - **AI Chatbot**: Ask about allocations (requires OpenAI key).

**Troubleshooting**:
- **Build Errors**: Clear cache with `npm run clean`.
- **Wallet Issues**: Ensure MetaMask is set to Polygon network.
- **Data Loading**: Backend must be running (see Step 5).

## Step 5: Run Backend (API & Streaming)
The Express server handles APIs, WebSockets, and integrations.

1. **Start Server**:
   ```bash
   cd backend
   npm start
   ```
   - APIs at http://localhost:3001; WebSockets at ws://localhost:8080.

2. **Test Endpoints**:
   - `GET /api/sim-data`: Fetches live sim data.
   - `POST /api/ai-predict`: AI predictions.
   - WebSocket: Streams real-time updates.

**Troubleshooting**:
- **Port Conflicts**: Change ports in `server.js`.
- **Auth Errors**: Check JWT_SECRET in `.env`.
- **Redis**: Ensure running for caching (`docker run -d -p 6379:6379 redis`).

## Step 6: Integrate Oracles (Off-Chain to On-Chain)
Oracles bridge sims to contracts for real-time updates.

1. **Run Bridge**:
   ```bash
   python oracles/chainlink_bridge.py
   ```
   - Feeds AI/quantum data to Chainlink, updates contracts.

2. **ZK Validation**:
   ```bash
   python oracles/zk_validator.py
   ```
   - Proves data integrity without revealing secrets.

**Troubleshooting**:
- **API Limits**: Chainlink has rate limits; use test keys.
- **Consensus**: Multi-oracle setup requires multiple keys.

## Step 7: Full Stack with Docker (Production-Ready)
For isolated, scalable deployment.

1. **Build and Run**:
   ```bash
   cd config
   docker-compose up --build
   ```
   - Launches all services: sims, contracts, frontend, backend, oracles, monitoring.

2. **Access**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - Monitoring: http://localhost:9090 (Prometheus), http://localhost:3000/grafana

**Troubleshooting**:
- **Build Fails**: Ensure Docker has enough resources.
- **Networking**: Services communicate via `gaia-net`; check logs with `docker-compose logs`.

## Step 8: Monitor and Maintain
Use the monitoring suite for observability.

1. **View Dashboards**:
   - Import `monitoring/grafana-dashboard.json` into Grafana.
   - Check metrics at Prometheus.

2. **Logs and Alerts**:
   - Logs in `logs/`; alerts via Prometheus rules.
   - Run `node monitoring/metrics.js` for custom exports.

**Troubleshooting**:
- **No Data**: Ensure exporters are running in Docker.
- **Alerts**: Configure email/Slack in Prometheus.

## Advanced Customization
- **Add Regions**: Edit sim data in `planetary_data` dicts.
- **Custom AI**: Modify `ai_optimizer.py` for new models.
- **Real Data**: Integrate APIs in `iot_simulator.py`.
- **Contribute**: See `docs/README.md` for guidelines.

## Next Steps
- Run `examples/use_case_drought.py` for a crisis scenario.
- Deploy to mainnet: Update networks in Hardhat config.
- Join the community: Open issues/PRs on GitHub.

If stuck, check `docs/README.md` or run `examples/automation_workflow.sh` for auto-setup. Gaia Protocol: Building planetary harmony, one sync at a time! 🚀
