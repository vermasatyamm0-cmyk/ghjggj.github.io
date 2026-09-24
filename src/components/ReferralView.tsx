import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Users, Copy, Share2, Check, Sparkles, Gift } from 'lucide-react';
import { soundService } from '../services/soundService';

interface ReferralViewProps {
  user: UserProfile;
}

export const ReferralView: React.FC<ReferralViewProps> = ({ user }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    soundService.playClick();
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    soundService.playClick();
    const text = `Join me on JK Coin and test your General Knowledge! Use my referral code "${user.referralCode}" to get 100 free JK Coins on signup:`;
    if (navigator.share) {
      navigator
        .share({
          title: 'JK Coin Referral',
          text,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-6 pb-28 max-w-7xl mx-auto px-4 pt-4 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-container to-blue-900 text-on-primary p-6 shadow-xl border border-primary/20 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
          <Users className="w-6 h-6 text-amber-300" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Invite Friends & Earn 200 JK Coins
          </h1>
          <p className="text-xs opacity-90 leading-relaxed max-w-md">
            Give your friends 100 bonus coins when they sign up with your referral code. You get 200 coins once they complete their first quiz!
          </p>
        </div>
      </div>

      {/* Code Copy & Share Card */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm text-center">
        <span className="text-xs font-bold text-on-surface-variant dark:text-zinc-400 uppercase tracking-wider">
          YOUR EXCLUSIVE REFERRAL CODE
        </span>

        <div className="flex items-center justify-center gap-3 bg-surface-container dark:bg-zinc-800 p-4 rounded-2xl border border-dashed border-primary/40">
          <span className="text-2xl font-black text-primary dark:text-blue-400 tracking-widest font-mono">
            {user.referralCode}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-surface-container-high dark:bg-zinc-800 text-on-surface dark:text-zinc-200 py-3.5 rounded-2xl font-bold text-xs hover:bg-surface-variant transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-primary" />}
            <span>{copied ? 'Code Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 bg-primary text-on-primary py-3.5 rounded-2xl font-bold text-xs shadow-md hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Link</span>
          </button>
        </div>
      </div>

      {/* Milestone Progress */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-3xl p-5 space-y-3 shadow-sm">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-on-surface dark:text-zinc-200">
            Ambassador Milestone (5 Friends = +400 Bonus)
          </span>
          <span className="text-primary dark:text-blue-400">
            {user.referralsCount} / 5 Friends Joined
          </span>
        </div>
        <div className="h-3 w-full bg-surface-container dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, (user.referralsCount / 5) * 100)}%` }}
          />
        </div>
      </div>

      {/* Recent Referral Activity */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-on-surface dark:text-zinc-100">
          Recent Referral Rewards
        </h3>
        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-3xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low dark:hover:bg-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                MR
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface dark:text-zinc-100">Michael R.</p>
                <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">Joined yesterday</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+200 🪙</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low dark:hover:bg-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                SK
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface dark:text-zinc-100">Siddharth K.</p>
                <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">Joined 3 days ago</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+200 🪙</span>
          </div>
        </div>
      </div>
    </div>
  );
};
