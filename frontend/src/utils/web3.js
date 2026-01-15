import { ethers } from 'ethers';
import GaiaDAO from '../../../contracts/GaiaDAO.sol';  // Adjust path

export async function connectWallet(contractAddress) {
  if (!window.ethereum) throw new Error('MetaMask not installed');
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, GaiaDAO.abi, signer);  // Load ABI
  return { signer, contract };
}
