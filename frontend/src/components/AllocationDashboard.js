import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function AllocationDashboard({ daoContract }) {
  const [allocations, setAllocations] = useState({});

  useEffect(() => {
    const fetchAllocations = async () => {
      if (!daoContract) return;
      // Assume ResourceAllocator is linked; fetch via DAO or direct call
      const alloc = await daoContract.getAllocation('0xSomeRegionAddress');  // Placeholder
      setAllocations({ region1: alloc.toString() });
    };
    fetchAllocations();
  }, [daoContract]);

  return (
    <div>
      <h2>Resource Allocations</h2>
      <ul>
        {Object.entries(allocations).map(([region, amount]) => (
          <li key={region}>{region}: {amount} units</li>
        ))}
      </ul>
    </div>
  );
}

export default AllocationDashboard;
