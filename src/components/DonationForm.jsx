import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';

export default function DonationForm({ onDonate }) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickAmounts = ['0.01', '0.05', '0.1', '0.5'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      await onDonate(amount);
      setAmount('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-xl">
          <Heart className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Make a Donation</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount (ETH)
          </label>
          <div className="relative">
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              ETH
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {quickAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all text-sm font-medium text-gray-700"
            >
              {preset} ETH
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || !amount}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            <>
              <Heart size={20} fill="currentColor" />
              Donate Now
            </>
          )}
        </button>
      </form>
    </div>
  );
}
