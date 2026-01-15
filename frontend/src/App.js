import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VoteForm from './components/VoteForm';
import AllocationDashboard from './components/AllocationDashboard';
import { connectWallet } from './utils/web3';

function App() {
  const [account, setAccount] = useState('');
  const [daoContract, setDaoContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { signer, contract } = await connectWallet('0xYourGaiaDAOAddress');  // Replace with deployed address
      setAccount(await signer.getAddress());
      setDaoContract(contract);
    };
    init();
  }, []);

  return (
    <div className="App">
      <h1>Gaia Protocol: Planetary Resource DAO</h1>
      <p>Connected Account: {account}</p>
      <VoteForm daoContract={daoContract} />
      <AllocationDashboard daoContract={daoContract} />
    </div>
  );
}

export default App;
