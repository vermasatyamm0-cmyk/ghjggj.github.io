import React, { useState } from 'react';
import { UserProfile, Transaction, RedeemRequest } from '../types';
import {
  Wallet,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  Smartphone,
  CreditCard,
  Gift
} from 'lucide-react';
import { soundService } from '../services/soundService';

interface WalletViewProps {
  user: UserProfile;
  transactions: Transaction[];
  redeemRequests: RedeemRequest[];
  onAddRedeemRequest: (req: Omit<RedeemRequest, 'id' | 'createdAt' | 'status'>) => void;
  onNavigateTab: (tab: 'referral' | 'rewards') => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  user,
  transactions,
  redeemRequests,
  onAddRedeemRequest,
  onNavigateTab
}) => {
  const [filterType, setFilterType] = useState<'all' | 'earned' | 'redeemed'>('all');
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [redeemType, setRedeemType] = useState<'UPI' | 'Paytm' | 'AmazonGiftCard' | 'GooglePlay'>('UPI');
  const [targetDetails, setTargetDetails] = useState('');
  const [amountCoins, setAmountCoins] = useState(500);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const estimatedINR = Math.round((user.coins / 10) * 100) / 100; // 100 Coins = 10 INR
  const weeklyGoalTarget = 500;
  const goalProgress = Math.min(100, Math.round((user.coins / weeklyGoalTarget) * 100));

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'earned') return tx.amount > 0;
    if (filterType === 'redeemed') return tx.amount < 0;
    return true;
  });

  const handleOpenRedeem = () => {
    soundService.playClick();
    setErrorMsg('');
    setSuccessMsg('');
    setIsRedeemModalOpen(true);
  };

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (user.coins < amountCoins) {
      setErrorMsg(`Insufficient balance. You need ${amountCoins} coins.`);
      soundService.playWrong();
      return;
    }

    if (!targetDetails || targetDetails.length < 5) {
      setErrorMsg('Please provide valid UPI ID or target payment details.');
      soundService.playWrong();
      return;
    }

    soundService.playCorrect();
    const amountINR = Math.round(amountCoins / 10);

    onAddRedeemRequest({
      userId: user.uid,
      userName: user.name,
      type: redeemType,
      targetDetails,
      amountCoins,
      amountINR
    });

    setSuccessMsg(`Redemption request of ₹${amountINR} submitted successfully!`);
    setTimeout(() => {
      setIsRedeemModalOpen(false);
      setSuccessMsg('');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-28 max-w-7xl mx-auto px-4 pt-4 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface dark:text-zinc-100 tracking-tight">
            JK Wallet & Payouts
          </h1>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
            Convert your JK Coins into real money, UPI cash, and gift cards.
          </p>
        </div>
      </div>

      {/* Balance Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950 text-white p-6 shadow-2xl border border-zinc-800 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                TOTAL BALANCE
              </span>
              <p className="text-xs text-amber-300 font-semibold">100 JK Coins = ₹10 INR</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ~ ₹{estimatedINR} INR Value
          </span>
        </div>

        {/* Big Balance Number */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl md:text-5xl font-black text-amber-300 tracking-tight">
            {user.coins.toLocaleString()}
          </span>
          <span className="text-lg font-bold text-zinc-300">JK Coins</span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleOpenRedeem}
            className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black py-3.5 px-6 rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Send className="w-4 h-4" />
            <span>Redeem Cash / UPI</span>
          </button>

          <button
            onClick={() => onNavigateTab('referral')}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-6 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Earn More Coins</span>
          </button>
        </div>
      </div>

      {/* Weekly Redeem Goal Tracker */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 p-5 rounded-3xl border border-outline-variant/40 dark:border-zinc-800 space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-on-surface dark:text-zinc-200">
            Weekly Payout Target (500 Coins = ₹50)
          </span>
          <span className="text-primary dark:text-blue-400">
            {user.coins} / {weeklyGoalTarget} Coins ({goalProgress}%)
          </span>
        </div>
        <div className="h-3 w-full bg-surface-container dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
      </div>

      {/* Active Payout Requests Section */}
      {redeemRequests.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-on-surface dark:text-zinc-100">
            Pending & Past Redemptions
          </h3>
          <div className="space-y-2">
            {redeemRequests.map((req) => (
              <div
                key={req.id}
                className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-2xl p-4 flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-on-surface dark:text-zinc-100">
                      ₹{req.amountINR} ({req.type})
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        req.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : req.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                          : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-0.5">
                    Target: {req.targetDetails}
                  </p>
                </div>
                <span className="text-xs font-bold text-outline">
                  {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-on-surface dark:text-zinc-100">
            Transaction History
          </h3>
          <div className="flex gap-1.5 bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 p-1 rounded-xl text-xs font-bold">
            {(['all', 'earned', 'redeemed'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  filterType === type
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant dark:text-zinc-400 hover:text-on-surface'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-3xl p-4 space-y-2 shadow-sm">
          {filteredTransactions.length === 0 ? (
            <p className="text-xs text-center text-outline py-6">No transactions found.</p>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.amount > 0
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {tx.amount > 0 ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface dark:text-zinc-100">
                      {tx.title}
                    </h4>
                    <p className="text-[10px] text-on-surface-variant dark:text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{tx.timestamp}</span>
                    </p>
                  </div>
                </div>
                <span
                  className={`font-black text-sm ${
                    tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} 🪙
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Redeem Modal */}
      {isRedeemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-surface dark:bg-zinc-900 border border-outline-variant/50 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setIsRedeemModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 text-outline"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-on-surface dark:text-zinc-100">
                Redeem Rewards
              </h2>
              <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
                Select your preferred payout method and enter target details.
              </p>
            </div>

            {/* Redeem Type Selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRedeemType('UPI')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2 text-xs font-bold transition-all ${
                  redeemType === 'UPI'
                    ? 'border-primary bg-primary/10 text-primary dark:text-blue-400'
                    : 'border-outline-variant/40 text-on-surface-variant'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI Direct</span>
              </button>

              <button
                type="button"
                onClick={() => setRedeemType('Paytm')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2 text-xs font-bold transition-all ${
                  redeemType === 'Paytm'
                    ? 'border-primary bg-primary/10 text-primary dark:text-blue-400'
                    : 'border-outline-variant/40 text-on-surface-variant'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Paytm Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setRedeemType('AmazonGiftCard')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2 text-xs font-bold transition-all ${
                  redeemType === 'AmazonGiftCard'
                    ? 'border-primary bg-primary/10 text-primary dark:text-blue-400'
                    : 'border-outline-variant/40 text-on-surface-variant'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>Amazon Gift Card</span>
              </button>

              <button
                type="button"
                onClick={() => setRedeemType('GooglePlay')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2 text-xs font-bold transition-all ${
                  redeemType === 'GooglePlay'
                    ? 'border-primary bg-primary/10 text-primary dark:text-blue-400'
                    : 'border-outline-variant/40 text-on-surface-variant'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Google Play Voucher</span>
              </button>
            </div>

            <form onSubmit={handleRedeemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1">
                  Target Details ({redeemType === 'UPI' ? 'UPI ID' : 'Phone / Email'})
                </label>
                <input
                  type="text"
                  value={targetDetails}
                  onChange={(e) => setTargetDetails(e.target.value)}
                  placeholder={
                    redeemType === 'UPI' ? 'e.g. alex@upi or 9876543210@paytm' : 'e.g. 9876543210'
                  }
                  className="w-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant/40 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-zinc-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1">
                  Redeem Amount (Minimum 500 Coins)
                </label>
                <select
                  value={amountCoins}
                  onChange={(e) => setAmountCoins(Number(e.target.value))}
                  className="w-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant/40 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-zinc-100 font-bold"
                >
                  <option value={500}>500 Coins (₹50 INR)</option>
                  <option value={1000}>1,000 Coins (₹100 INR)</option>
                  <option value={2500}>2,500 Coins (₹250 INR)</option>
                  <option value={5000}>5,000 Coins (₹500 INR)</option>
                </select>
              </div>

              {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-3.5 rounded-2xl font-bold text-sm shadow-md hover:bg-primary-container transition-all"
              >
                Submit Payout Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
