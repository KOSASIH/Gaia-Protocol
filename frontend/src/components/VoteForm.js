import React, { useState } from 'react';

function VoteForm({ daoContract }) {
  const [proposalId, setProposalId] = useState('');
  const [support, setSupport] = useState(true);
  const [amount, setAmount] = useState(0);

  const handleVote = async () => {
    if (!daoContract) return;
    try {
      const tx = await daoContract.vote(proposalId, support, amount);
      await tx.wait();
      alert('Vote submitted!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Vote on Proposal</h2>
      <input placeholder="Proposal ID" onChange={(e) => setProposalId(e.target.value)} />
      <select onChange={(e) => setSupport(e.target.value === 'true')}>
        <option value="true">For</option>
        <option value="false">Against</option>
      </select>
      <input type="number" placeholder="Vote Amount" onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleVote}>Vote</button>
    </div>
  );
}

export default VoteForm;
