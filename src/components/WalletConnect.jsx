import { Wallet } from 'lucide-react';

export default function WalletConnect({ wallet, onConnect }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
            <Wallet className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Wallet Status</h3>
            <p className="text-lg font-semibold text-gray-900">
              {wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : 'Not Connected'}
            </p>
          </div>
        </div>
        <button
          onClick={onConnect}
          disabled={!!wallet}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            wallet
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:scale-105'
          }`}
        >
          {wallet ? 'Connected' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
}
