const { ethers } = require('ethers');
const LoggerUtils = require('./logger');

class Web3Helpers {
  static async connectToPolygon(providerUrl, privateKey) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    LoggerUtils.logInfo('Connected to Polygon', { address: wallet.address });
    return wallet;
  }

  static async estimateGas(contract, method, args) {
    try {
      const gasEstimate = await contract.estimateGas[method](...args);
      LoggerUtils.logInfo('Gas Estimate', { method, gasEstimate: gasEstimate.toString() });
      return gasEstimate;
    } catch (error) {
      LoggerUtils.logError('Gas Estimation Failed', error);
      throw error;
    }
  }

  static async batchTransactions(wallet, txs) {
    const batch = [];
    for (const tx of txs) {
      batch.push(await wallet.sendTransaction(tx));
    }
    LoggerUtils.logInfo('Batch Transactions Sent', { count: batch.length });
    return batch;
  }
}

module.exports = Web3Helpers;
