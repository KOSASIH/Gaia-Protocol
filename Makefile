.PHONY: setup install run test deploy clean monitor audit

# Setup environment
setup:
	@echo "Setting up Gaia Protocol..."
	@npm install
	@pip install -r requirements.txt
	@cd frontend && npm install
	@cd backend && npm install
	@echo "Setup complete. Run 'make run' to start."

# Install dependencies
install: setup

# Run full stack with Docker
run:
	@echo "Starting Gaia Protocol stack..."
	@cd config && docker-compose up --build -d
	@echo "Stack running. Access frontend at http://localhost:3000"

# Run simulations
sims:
	@echo "Running simulations..."
	@python simulations/quantum_ledger.py
	@python simulations/ai_optimizer.py
	@python simulations/iot_simulator.py

# Run tests
test:
	@echo "Running tests..."
	@npm test
	@cd backend && npm test

# Deploy contracts
deploy:
	@echo "Deploying contracts..."
	@npx hardhat run scripts/deploy.js --network polygonMumbai

# Monitor stack
monitor:
	@echo "Starting monitoring..."
	@cd monitoring && docker-compose up -d
	@echo "Grafana at http://localhost:3000/grafana"

# Run security audit
audit:
	@echo "Running security audit..."
	@node security/audit_contracts.js
	@python security/vulnerability_scan.py

# Clean up
clean:
	@echo "Cleaning up..."
	@cd config && docker-compose down
	@rm -rf node_modules __pycache__ logs/
	@echo "Cleanup complete."

# Help
help:
	@echo "Gaia Protocol Makefile Commands:"
	@echo "  setup    - Install dependencies and setup environment"
	@echo "  run      - Start full stack with Docker"
	@echo "  sims     - Run quantum/AI/IoT simulations"
	@echo "  test     - Run all tests"
	@echo "  deploy   - Deploy contracts to Polygon"
	@echo "  monitor  - Start monitoring stack"
	@echo "  audit    - Run security audits"
	@echo "  clean    - Clean up containers and files"
	@echo "  help     - Show this help"
