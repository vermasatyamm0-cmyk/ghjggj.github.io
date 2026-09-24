import React, { useState } from 'react';
import { LeaderboardUser, UserProfile } from '../types';
import { Trophy, Medal, Sparkles, Flame, UserCheck } from 'lucide-react';

interface LeaderboardViewProps {
  user: UserProfile;
  leaderboardUsers: LeaderboardUser[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ user, leaderboardUsers }) => {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');

  const sortedUsers = [...leaderboardUsers].sort((a, b) => b.xp - a.xp);
  const top1 = sortedUsers[0];
  const top2 = sortedUsers[1];
  const top3 = sortedUsers[2];
  const rest = sortedUsers.slice(3);

  const currentUserRank = sortedUsers.findIndex((u) => u.uid === user.uid) + 1;

  return (
    <div className="space-y-6 pb-32 max-w-7xl mx-auto px-4 pt-4 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface dark:text-zinc-100 tracking-tight">
            Leaderboard
          </h1>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
            Compete with top scholars and earn weekly JK Coin prizes!
          </p>
        </div>

        {/* Time Period Filter Pills */}
        <div className="flex gap-1.5 bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 p-1.5 rounded-2xl">
          {(['weekly', 'monthly', 'alltime'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPeriod(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                period === t
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant dark:text-zinc-400 hover:text-on-surface'
              }`}
            >
              {t === 'alltime' ? 'All Time' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Section */}
      <div className="pt-6 pb-2 grid grid-cols-3 gap-2 items-end max-w-md mx-auto">
        {/* Rank 2 (Silver) */}
        {top2 && (
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <img
                src={top2.avatarUrl}
                alt={top2.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-300 dark:ring-slate-500 shadow-md"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-900 font-black text-[10px] w-6 h-6 rounded-full flex items-center justify-center shadow">
                2
              </div>
            </div>
            <p className="text-xs font-bold text-on-surface dark:text-zinc-100 truncate w-20 text-center">
              {top2.name}
            </p>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {top2.xp.toLocaleString()} XP
            </p>
            <div className="mt-2 w-full h-20 bg-slate-200/50 dark:bg-zinc-800/80 rounded-t-2xl border-t-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
              <Medal className="w-6 h-6 text-slate-400" />
            </div>
          </div>
        )}

        {/* Rank 1 (Gold - Center Tallest) */}
        {top1 && (
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Sparkles className="w-6 h-6 text-amber-400 fill-amber-300 animate-bounce" />
              </div>
              <img
                src={top1.avatarUrl}
                alt={top1.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-xl"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-zinc-950 font-black text-xs w-7 h-7 rounded-full flex items-center justify-center shadow">
                1
              </div>
            </div>
            <p className="text-sm font-black text-amber-500 truncate w-24 text-center">
              {top1.name}
            </p>
            <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
              {top1.xp.toLocaleString()} XP
            </p>
            <div className="mt-2 w-full h-28 bg-amber-500/20 dark:bg-amber-950/40 rounded-t-2xl border-t-4 border-amber-400 flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-amber-500 fill-amber-400" />
            </div>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3 && (
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <img
                src={top3.avatarUrl}
                alt={top3.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-700/60 shadow-md"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-800 text-white font-black text-[10px] w-6 h-6 rounded-full flex items-center justify-center shadow">
                3
              </div>
            </div>
            <p className="text-xs font-bold text-on-surface dark:text-zinc-100 truncate w-20 text-center">
              {top3.name}
            </p>
            <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500">
              {top3.xp.toLocaleString()} XP
            </p>
            <div className="mt-2 w-full h-16 bg-amber-800/10 dark:bg-zinc-800/80 rounded-t-2xl border-t-2 border-amber-700 flex items-center justify-center">
              <Medal className="w-6 h-6 text-amber-700" />
            </div>
          </div>
        )}
      </div>

      {/* Rank List (4th and beyond) */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-3xl p-3 space-y-2 shadow-sm">
        {rest.map((usr, idx) => {
          const rankNum = idx + 4;
          const isCurrent = usr.isCurrentUser || usr.uid === user.uid;

          return (
            <div
              key={usr.uid}
              className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                isCurrent
                  ? 'bg-primary/10 dark:bg-blue-950/40 border border-primary/30 font-bold'
                  : 'hover:bg-surface-container-low dark:hover:bg-zinc-800/50'
              }`}
            >
              <span className="font-extrabold text-sm text-outline w-6 text-center">
                {rankNum}
              </span>
              <img
                src={usr.avatarUrl}
                alt={usr.name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-on-surface dark:text-zinc-100">
                    {usr.name}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] font-extrabold bg-primary text-on-primary px-1.5 py-0.2 rounded">
                      YOU
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">{usr.title}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-primary dark:text-blue-400">
                  {usr.xp.toLocaleString()} XP
                </span>
                <p className="text-[10px] text-amber-500 font-semibold">{usr.coins} 🪙</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom "Your Rank" Anchor Card */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-30 bg-gradient-to-r from-primary to-blue-900 text-on-primary p-4 rounded-2xl shadow-2xl border border-primary/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-sm">
            #{currentUserRank || 12}
          </div>
          <div>
            <p className="text-xs font-bold">Your Global Rank</p>
            <p className="text-[10px] opacity-80">{user.xp.toLocaleString()} Total XP</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-amber-300" />
            <span>Top 10% Scholar</span>
          </span>
        </div>
      </div>
    </div>
  );
};
