import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Chart from 'chart.js/auto';

function AllocationDashboard({ daoContract, realTimeData }) {
  const [allocations, setAllocations] = useState({});
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAllocations = async () => {
      if (!daoContract) return;
      const alloc = await daoContract.getAllocation('0xSomeRegionAddress');
      setAllocations({ region1: ethers.utils.formatEther(alloc), ...realTimeData.allocations });
    };
    fetchAllocations();
  }, [daoContract, realTimeData]);

  useEffect(() => {
    if (chartRef.current) {
      new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: Object.keys(allocations),
          datasets: [{
            label: 'Resource Allocations',
            data: Object.values(allocations),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          }]
        }
      });
    }
  }, [allocations]);

  return (
    <div>
      <h2>Resource Allocations Dashboard</h2>
      <canvas ref={chartRef}></canvas>
      <ul>
        {Object.entries(allocations).map(([region, amount]) => (
          <li key={region}>{region}: {amount} units</li>
        ))}
      </ul>
    </div>
  );
}

export default AllocationDashboard;
