const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { spawn } = require('child_process');
const jwt = require('jsonwebtoken');
const redis = require('redis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));  // Rate limiting

// Redis for caching
const redisClient = redis.createClient();
redisClient.connect();

// WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    console.log('Received:', message);
  });
  // Stream sim data
  setInterval(() => {
    const simData = runSim('quantum_ledger.py');  // Simplified
    ws.send(JSON.stringify(simData));
  }, 10000);
});

// Auth Middleware
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

// Routes
app.get('/api/sim-data', authenticate, async (req, res) => {
  const cached = await redisClient.get('simData');
  if (cached) return res.json(JSON.parse(cached));
  const data = await runSimAsync('simulations/quantum_ledger.py');
  await redisClient.setEx('simData', 300, JSON.stringify(data));  // Cache 5min
  res.json(data);
});

app.post('/api/ai-predict', authenticate, async (req, res) => {
  const { query } = req.body;
  const prediction = await getAIPrediction(query);
  res.json({ prediction });
});

app.post('/api/contract-interact', authenticate, async (req, res) => {
  // Placeholder for contract calls via ethers
  res.json({ status: 'Interaction successful' });
});

// Helper Functions
function runSim(script) {
  // Synchronous sim run (for demo)
  return { synced: 'data', consensus: 'agreed' };
}

async function runSimAsync(script) {
  return new Promise((resolve) => {
    const process = spawn('python', [script]);
    let data = '';
    process.stdout.on('data', (chunk) => data += chunk);
    process.on('close', () => resolve(JSON.parse(data || '{}')));
  });
}

async function getAIPrediction(query) {
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: query }]
  }, {
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
  });
  return response.data.choices[0].message.content;
}

app.listen(PORT, () => {
  console.log(`Gaia Backend running on port ${PORT}`);
});
