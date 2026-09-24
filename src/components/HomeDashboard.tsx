import React from 'react';
import { UserProfile, Question } from '../types';
import {
  Flame,
  Gift,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Wallet,
  Building2,
  Medal,
  Award,
  Lock,
  Zap,
  Sparkles
} from 'lucide-react';
import { soundService } from '../services/soundService';

interface HomeDashboardProps {
  user: UserProfile;
  onStartQuiz: (categoryId?: string) => void;
  onClaimDailyBonus: () => void;
  onNavigateTab: (tab: 'quiz' | 'wallet' | 'leaderboard' | 'rewards' | 'profile') => void;
  hasClaimedDaily: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  onStartQuiz,
  onClaimDailyBonus,
  onNavigateTab,
  hasClaimedDaily
}) => {
  const levelProgress = Math.min(100, Math.round(((user.xp % 250) / 250) * 100));

  const handleClaim = () => {
    if (!hasClaimedDaily) {
      soundService.playFanfare();
      onClaimDailyBonus();
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 pt-4 animate-fadeIn">
      {/* Today's Challenge Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-container to-blue-900 text-on-primary p-6 shadow-xl border border-primary/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-md">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>TODAY'S CHALLENGE</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              General Knowledge & Blockchain Basics
            </h2>
            <p className="opacity-90 text-sm leading-relaxed">
              Complete today's challenge module and earn a <span className="font-bold text-amber-300">2x JK Coin multiplier</span> for 30 minutes!
            </p>
          </div>
          <button
            onClick={() => onStartQuiz('general_knowledge')}
            className="bg-secondary-container text-on-secondary-container dark:bg-amber-400 dark:text-zinc-950 font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>Start Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* Stats & Daily Bonus Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Level & XP Card */}
        <div className="bg-surface-container-lowest dark:bg-zinc-900 p-5 rounded-3xl border border-outline-variant/40 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-on-surface-variant dark:text-zinc-400 uppercase tracking-wider">
              Current Level
            </span>
            <span className="text-xl font-bold text-primary dark:text-blue-400">
              Level {user.level}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-on-surface-variant dark:text-zinc-400">
              <span>Progress to Level {user.level + 1}</span>
              <span>{levelProgress}%</span>
            </div>
            <div className="h-3 w-full bg-surface-container dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Streak Card */}
        <div className="bg-surface-container-lowest dark:bg-zinc-900 p-5 rounded-3xl border border-outline-variant/40 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
            <Flame className="w-7 h-7 fill-amber-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-on-surface dark:text-zinc-100">
              {user.streakDays} Days
            </h3>
            <p className="text-xs text-on-surface-variant dark:text-zinc-400 font-medium">
              Daily Streak Active!
            </p>
          </div>
        </div>

        {/* Daily Bonus Claim Card */}
        <div className="bg-surface-container-lowest dark:bg-zinc-900 p-5 rounded-3xl border border-outline-variant/40 dark:border-zinc-800 shadow-sm flex flex-col justify-between relative group overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <h3 className="text-lg font-bold text-on-surface dark:text-zinc-100">
                Daily Reward
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-zinc-400">
                {hasClaimedDaily ? 'Claimed for Today' : 'Ready to claim'}
              </p>
            </div>
            <Gift className="w-6 h-6 text-amber-500" />
          </div>
          <button
            onClick={handleClaim}
            disabled={hasClaimedDaily}
            className={`w-full mt-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
              hasClaimedDaily
                ? 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 cursor-default'
                : 'bg-primary text-on-primary hover:bg-primary-container active:scale-95'
            }`}
          >
            {hasClaimedDaily ? (
              <span>Claimed (+50 🪙) ✅</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Claim 50 🪙</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Continue Quiz Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-on-surface dark:text-zinc-100">
            Continue Quiz
          </h2>
          <button
            onClick={() => onNavigateTab('quiz')}
            className="text-primary dark:text-blue-400 text-xs font-bold flex items-center hover:underline"
          >
            <span>See all</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {/* Card 1 */}
          <div
            onClick={() => onStartQuiz('technology')}
            className="min-w-[260px] bg-surface-container-lowest dark:bg-zinc-900 rounded-3xl border border-outline-variant/40 dark:border-zinc-800 p-4 space-y-3 cursor-pointer hover:shadow-md transition-all"
          >
            <div className="h-28 rounded-2xl overflow-hidden relative bg-gradient-to-r from-blue-900 to-indigo-950 flex items-center justify-center p-3">
              <div className="text-center text-white">
                <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                  Tech & AI
                </span>
                <h4 className="font-bold text-base mt-0.5">Market Analysis</h4>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs font-medium text-on-surface-variant dark:text-zinc-400">
              <span>Question 8/12</span>
              <div className="w-20 h-1.5 bg-surface-container dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary dark:bg-blue-400 w-[66%]" />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onStartQuiz('economics')}
            className="min-w-[260px] bg-surface-container-lowest dark:bg-zinc-900 rounded-3xl border border-outline-variant/40 dark:border-zinc-800 p-4 space-y-3 cursor-pointer hover:shadow-md transition-all"
          >
            <div className="h-28 rounded-2xl overflow-hidden relative bg-gradient-to-r from-emerald-900 to-teal-950 flex items-center justify-center p-3">
              <div className="text-center text-white">
                <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">
                  Personal Finance
                </span>
                <h4 className="font-bold text-base mt-0.5">Smart Saving & Interest</h4>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs font-medium text-on-surface-variant dark:text-zinc-400">
              <span>Question 3/10</span>
              <div className="w-20 h-1.5 bg-surface-container dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary dark:bg-blue-400 w-[30%]" />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onStartQuiz('space')}
            className="min-w-[260px] bg-surface-container-lowest dark:bg-zinc-900 rounded-3xl border border-outline-variant/40 dark:border-zinc-800 p-4 space-y-3 cursor-pointer hover:shadow-md transition-all"
          >
            <div className="h-28 rounded-2xl overflow-hidden relative bg-gradient-to-r from-purple-950 to-zinc-900 flex items-center justify-center p-3">
              <div className="text-center text-white">
                <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold">
                  Space & Universe
                </span>
                <h4 className="font-bold text-base mt-0.5">ISRO & Cosmic Mysteries</h4>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs font-medium text-on-surface-variant dark:text-zinc-400">
              <span>Question 14/15</span>
              <div className="w-20 h-1.5 bg-surface-container dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary dark:bg-blue-400 w-[93%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-on-surface dark:text-zinc-100">
          Featured Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => onStartQuiz('economics')}
            className="bg-primary-container/10 border border-primary/20 p-4 rounded-3xl flex flex-col items-center text-center gap-3 cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-on-surface dark:text-zinc-100">
              Budgeting
            </span>
          </div>

          <div
            onClick={() => onStartQuiz('technology')}
            className="bg-secondary-container/20 border border-secondary/20 p-4 rounded-3xl flex flex-col items-center text-center gap-3 cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center shadow-md">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-on-surface dark:text-zinc-100">
              Trading & Crypto
            </span>
          </div>

          <div
            onClick={() => onStartQuiz('india_gk')}
            className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-3xl flex flex-col items-center text-center gap-3 cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-on-surface dark:text-zinc-100">
              India GK
            </span>
          </div>

          <div
            onClick={() => onStartQuiz('science')}
            className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-3xl flex flex-col items-center text-center gap-3 cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-on-surface dark:text-zinc-100">
              Science & Nature
            </span>
          </div>
        </div>
      </section>

      {/* Leaderboard & Achievements Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leaderboard Preview */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-on-surface dark:text-zinc-100">
              Top Performers
            </h2>
            <button
              onClick={() => onNavigateTab('leaderboard')}
              className="text-xs font-bold text-primary dark:text-blue-400 hover:underline"
            >
              View Board
            </button>
          </div>
          <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-3xl border border-outline-variant/40 dark:border-zinc-800 p-3 space-y-2 shadow-sm">
            <div className="flex items-center gap-3 p-3 bg-amber-500/10 dark:bg-amber-950/30 rounded-2xl border border-amber-500/20">
              <span className="font-bold text-amber-500 text-sm w-4">1</span>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                alt="Sarah"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400"
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-on-surface dark:text-zinc-100">Sarah Williams</p>
                <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">58,200 XP</p>
              </div>
              <Medal className="w-5 h-5 text-amber-500 fill-amber-400" />
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-surface-container-low dark:hover:bg-zinc-800/50 transition-colors rounded-2xl">
              <span className="font-bold text-on-surface-variant text-sm w-4">2</span>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                alt="Alex"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-on-surface dark:text-zinc-100">Alex Rivera</p>
                <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">42,500 XP</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-primary/5 dark:bg-blue-950/30 rounded-2xl border border-primary/10">
              <span className="font-bold text-primary dark:text-blue-400 text-sm w-4">12</span>
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                AJ
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-primary dark:text-blue-400">You ({user.name})</p>
                <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">{user.xp.toLocaleString()} XP</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Achievements */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-on-surface dark:text-zinc-100">
              Recent Badges
            </h2>
            <button
              onClick={() => onNavigateTab('rewards')}
              className="text-xs font-bold text-primary dark:text-blue-400 hover:underline"
            >
              All Badges
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-2xl p-3 flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-on-surface dark:text-zinc-200">
                First Win
              </span>
            </div>

            <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-2xl p-3 flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-300 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-on-surface dark:text-zinc-200">
                7-Day Streak
              </span>
            </div>

            <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-2xl p-3 flex flex-col items-center gap-2 text-center opacity-60">
              <div className="w-10 h-10 rounded-full bg-surface-container dark:bg-zinc-800 flex items-center justify-center text-outline">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-on-surface dark:text-zinc-400">
                Top 100
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
