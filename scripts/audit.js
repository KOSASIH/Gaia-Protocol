const { exec } = require('child_process');

function auditContract(contractPath) {
  exec(`slither ${contractPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Audit Error: ${error}`);
      return;
    }
    console.log(`Audit Results:\n${stdout}`);
  });
}

// Example
auditContract('contracts/GaiaDAO.sol');
