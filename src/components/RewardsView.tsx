import React from 'react';
import { UserProfile, Achievement } from '../types';
import { Sparkles, Flame, Award, CheckCircle2, Lock, Gift, ChevronRight } from 'lucide-react';
import { soundService } from '../services/soundService';

interface RewardsViewProps {
  user: UserProfile;
  achievements: Achievement[];
  onClaimAchievement: (achievementId: string) => void;
  onNavigateTab: (tab: 'rewards' | 'quiz') => void;
  onOpenSpinWheel: () => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  user,
  achievements,
  onClaimAchievement,
  onNavigateTab,
  onOpenSpinWheel
}) => {
  const streakDays = [
    { day: 1, coins: 20 },
    { day: 2, coins: 30 },
    { day: 3, coins: 40 },
    { day: 4, coins: 50 },
    { day: 5, coins: 60 },
    { day: 6, coins: 80 },
    { day: 7, coins: 100, isChest: true }
  ];

  const handleClaim = (achId: string) => {
    soundService.playFanfare();
    onClaimAchievement(achId);
  };

  return (
    <div className="space-y-6 pb-28 max-w-7xl mx-auto px-4 pt-4 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-on-surface dark:text-zinc-100 tracking-tight">
          Rewards & Badges
        </h1>
        <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
          Complete learning milestones, maintain streaks, and claim bonus JK Coins.
        </p>
      </div>

      {/* Lucky Spin Launch Banner */}
      <div
        onClick={onOpenSpinWheel}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-zinc-950 p-5 shadow-xl border border-amber-300 cursor-pointer hover:scale-[1.01] transition-transform flex items-center justify-between"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 fill-zinc-950" />
            <span>DAILY SPIN WHEEL</span>
          </div>
          <h3 className="text-lg font-black tracking-tight">Win Up To 300 Free JK Coins</h3>
          <p className="text-xs font-semibold opacity-90">Free spin available every 24 hours!</p>
        </div>
        <div className="bg-zinc-950 text-amber-400 font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1 shadow">
          <span>Spin Now</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* 7-Day Daily Streak Progress Card */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Flame className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface dark:text-zinc-100">
                {user.streakDays}-Day Login Streak
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-zinc-400">
                Play daily to unlock the Day 7 Mega Chest!
              </p>
            </div>
          </div>
        </div>

        {/* 7 Day Timeline Pills */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-2">
          {streakDays.map((s) => {
            const isPassed = s.day <= user.streakDays;
            const isToday = s.day === user.streakDays;

            return (
              <div
                key={s.day}
                className={`flex flex-col items-center justify-between p-2 rounded-2xl border text-center transition-all ${
                  isPassed
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400'
                    : 'bg-surface-container-low dark:bg-zinc-800/60 border-outline-variant/30 text-outline'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase">D{s.day}</span>
                <div className="my-1.5">
                  {s.isChest ? (
                    <Gift className={`w-5 h-5 ${isPassed ? 'text-amber-500' : 'text-outline'}`} />
                  ) : (
                    <Sparkles
                      className={`w-4 h-4 ${isPassed ? 'text-amber-500 fill-amber-400' : 'text-outline'}`}
                    />
                  )}
                </div>
                <span className="text-[10px] font-bold">+{s.coins}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Matrix */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-on-surface dark:text-zinc-100">
          Achievements & Badges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((ach) => {
            const progressPercent = Math.min(
              100,
              Math.round((ach.currentCount / ach.targetCount) * 100)
            );
            const canClaim = ach.currentCount >= ach.targetCount && !ach.unlocked;

            return (
              <div
                key={ach.id}
                className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-3xl p-5 space-y-3 flex flex-col justify-between shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        ach.unlocked
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-surface-container dark:bg-zinc-800 text-outline'
                      }`}
                    >
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-on-surface dark:text-zinc-100">
                        {ach.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-0.5">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress bar & Claim button */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/30 dark:border-zinc-800">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-on-surface-variant dark:text-zinc-400">
                      {ach.currentCount} / {ach.targetCount} Completed
                    </span>
                    <span className="text-amber-500 font-extrabold">+{ach.rewardCoins} 🪙</span>
                  </div>

                  <div className="h-2 w-full bg-surface-container dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {canClaim && (
                    <button
                      onClick={() => handleClaim(ach.id)}
                      className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 py-2.5 rounded-xl font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 fill-zinc-950" />
                      <span>Claim +{ach.rewardCoins} JK Coins</span>
                    </button>
                  )}

                  {ach.unlocked && (
                    <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Unlocked & Claimed</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
