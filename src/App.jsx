import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './contracts/etherCharity.js';
import WalletConnect from './components/WalletConnect.jsx';
import BalanceCard from './components/BalanceCard.jsx';
import DonationForm from './components/DonationForm.jsx';
import LogsTable from './components/LogsTable.jsx';
import { Heart } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [contractBalance, setContractBalance] = useState('0');
  const [logs, setLogs] = useState({ donations: [], transfers: [] });
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this app!');
      return;
    }

    try {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setWallet(account);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  };

  const handleDonate = async (amount) => {
    if (!wallet) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const contract = await getContract();
      const tx = await contract.deposit({
        value: ethers.parseEther(amount),
      });

      await tx.wait();

      await axios.post(`${API_BASE_URL}/donate`, {
        donor: wallet,
        amount: amount,
        txHash: tx.hash,
      });

      alert('Donation successful! Thank you for your contribution.');

      fetchContractBalance();
      fetchLogs();
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Donation failed. Please try again.');
      throw error;
    }
  };

  const fetchContractBalance = async () => {
    setIsLoadingBalance(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const balance = await contract.getContractBalance();
      setContractBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Failed to fetch contract balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/logs/all`);
      setLogs(res.data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  useEffect(() => {
    if (wallet) {
      fetchContractBalance();
      fetchLogs();
    }
  }, [wallet]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-4 rounded-2xl shadow-lg">
              <Heart className="text-white" size={40} fill="currentColor" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Ether Charity Fund
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Support meaningful causes through transparent blockchain donations. Every contribution makes a difference.
          </p>
        </header>

        <div className="space-y-8">
          <WalletConnect wallet={wallet} onConnect={connectWallet} />

          {wallet && (
            <>
              <BalanceCard
                balance={contractBalance}
                onRefresh={fetchContractBalance}
                isLoading={isLoadingBalance}
              />

              <div className="grid lg:grid-cols-1 gap-8">
                <DonationForm onDonate={handleDonate} />
              </div>

              <LogsTable donations={logs.donations} transfers={logs.transfers} />
            </>
          )}

          {!wallet && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Heart size={40} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Connect Your Wallet to Get Started
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Connect your MetaMask wallet to view donation history and make contributions to the charity fund.
              </p>
            </div>
          )}
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Built on Ethereum blockchain for transparent and secure donations</p>
        </footer>
      </div>
    </div>
  );
}
