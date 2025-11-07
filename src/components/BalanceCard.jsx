import { TrendingUp, RefreshCw } from 'lucide-react';

export default function BalanceCard({ balance, onRefresh, isLoading }) {
  return (
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-8 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <TrendingUp size={28} />
          </div>
          <h2 className="text-xl font-semibold">Total Funds Raised</h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all duration-200 backdrop-blur-sm"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="mt-6">
        <p className="text-5xl font-bold tracking-tight">{balance} ETH</p>
        <p className="text-emerald-100 mt-2 text-sm">Available in contract</p>
      </div>
    </div>
  );
}
