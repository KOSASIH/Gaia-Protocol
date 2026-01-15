import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VoteForm from './components/VoteForm';
import AllocationDashboard from './components/AllocationDashboard';
import PlanetaryMap from './components/PlanetaryMap';  // New 3D component
import AIChatbot from './components/AIChatbot';  // New AI assistant
import { connectWallet } from './utils/web3';
import './App.css';  // Add styles

function App() {
  const [account, setAccount] = useState('');
  const [daoContract, setDaoContract] = useState(null);
  const [realTimeData, setRealTimeData] = useState({});  // From sims

  useEffect(() => {
    const init = async () => {
      const { signer, contract } = await connectWallet('0xYourGaiaDAOAddress');
      setAccount(await signer.getAddress());
      setDaoContract(contract);
      // Fetch real-time sim data via API/WebSocket
      fetchSimData();
    };
    init();
  }, []);

  const fetchSimData = async () => {
    // Simulate API call to backend running sims
    const response = await fetch('http://localhost:3001/sim-data');  // Add backend server
    const data = await response.json();
    setRealTimeData(data);
  };

  return (
    <div className="App">
      <header>
        <h1>Gaia Protocol: Planetary Resource DAO</h1>
        <p>Connected Account: {account}</p>
        <button onClick={fetchSimData}>Refresh Data</button>
      </header>
      <main>
        <PlanetaryMap data={realTimeData} />
        <VoteForm daoContract={daoContract} />
        <AllocationDashboard daoContract={daoContract} realTimeData={realTimeData} />
        <AIChatbot />
      </main>
    </div>
  );
}

export default App;
