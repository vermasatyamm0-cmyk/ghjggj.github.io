import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Clock, CheckCircle2, RotateCcw, Home, Share2 } from 'lucide-react';
import { soundService } from '../services/soundService';

interface QuizResultModalProps {
  results: {
    totalQuestions: number;
    correctCount: number;
    coinsEarned: number;
    xpEarned: number;
    timeTakenSeconds: number;
  };
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const QuizResultModal: React.FC<QuizResultModalProps> = ({
  results,
  onPlayAgain,
  onGoHome
}) => {
  const accuracyPercent = Math.round((results.correctCount / results.totalQuestions) * 100);
  const isPerfect = results.correctCount === results.totalQuestions && results.totalQuestions > 0;
  const bonusCoins = isPerfect ? 50 : 0;
  const finalCoins = results.coinsEarned + bonusCoins;

  useEffect(() => {
    soundService.playFanfare();
    // Launch celebratory confetti burst
    confetti({
      particleCount: isPerfect ? 120 : 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, [isPerfect]);

  const handleShare = () => {
    soundService.playClick();
    if (navigator.share) {
      navigator
        .share({
          title: 'JK Coin Quiz Master',
          text: `I scored ${accuracyPercent}% and earned ${finalCoins} JK Coins on JK Coin Quiz! Can you beat my score?`
        })
        .catch(() => {});
    } else {
      alert(`Result copied! I earned ${finalCoins} JK Coins on JK Coin!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface dark:bg-zinc-900 border border-outline-variant/50 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 text-center overflow-hidden">
        {/* Top Trophy Artwork */}
        <div className="relative mx-auto w-24 h-24 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-full flex items-center justify-center shadow-xl">
          <Trophy className="w-12 h-12 text-zinc-950 fill-amber-200 animate-bounce" />
          <div className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
            {accuracyPercent >= 80 ? 'Master' : 'Completed'}
          </div>
        </div>

        {/* Header Text */}
        <div>
          <h2 className="text-2xl font-black text-on-surface dark:text-zinc-100 tracking-tight">
            {isPerfect
              ? 'Flawless Victory! 🎉'
              : accuracyPercent >= 70
              ? 'Great Job! 🌟'
              : 'Quiz Completed! 👍'}
          </h2>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
            {isPerfect
              ? 'Perfect score! You unlocked a +50 Bonus JK Coin reward!'
              : 'Keep practicing to level up your financial & GK knowledge!'}
          </p>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Coins Earned Card */}
          <div className="bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 p-4 rounded-2xl flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-amber-500 font-bold mb-1">
              <Sparkles className="w-4 h-4 fill-amber-400" />
              <span className="text-2xl font-black">+{finalCoins}</span>
            </div>
            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
              JK Coins Earned {bonusCoins > 0 && '(+50 Perfect)'}
            </span>
          </div>

          {/* XP Earned Card */}
          <div className="bg-primary/10 dark:bg-blue-950/40 border border-primary/30 p-4 rounded-2xl flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-primary dark:text-blue-400 mb-1">
              +{results.xpEarned}
            </span>
            <span className="text-[11px] font-semibold text-primary dark:text-blue-300">
              Player XP Gained
            </span>
          </div>

          {/* Accuracy Card */}
          <div className="bg-surface-container-lowest dark:bg-zinc-800 border border-outline-variant/40 dark:border-zinc-700 p-3 rounded-2xl flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <div className="text-left">
              <p className="text-sm font-bold text-on-surface dark:text-zinc-100">
                {results.correctCount} / {results.totalQuestions}
              </p>
              <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">
                Correct ({accuracyPercent}%)
              </p>
            </div>
          </div>

          {/* Time Taken Card */}
          <div className="bg-surface-container-lowest dark:bg-zinc-800 border border-outline-variant/40 dark:border-zinc-700 p-3 rounded-2xl flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <div className="text-left">
              <p className="text-sm font-bold text-on-surface dark:text-zinc-100">
                {results.timeTakenSeconds}s
              </p>
              <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">Total Duration</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onPlayAgain}
            className="w-full bg-primary text-on-primary py-3.5 rounded-2xl font-bold text-sm shadow-md hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Another Quiz</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex-1 bg-surface-container-high dark:bg-zinc-800 text-on-surface dark:text-zinc-200 py-3 rounded-2xl font-bold text-xs hover:bg-surface-variant transition-all flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-primary" />
              <span>Share Result</span>
            </button>

            <button
              onClick={onGoHome}
              className="flex-1 bg-surface-container-high dark:bg-zinc-800 text-on-surface dark:text-zinc-200 py-3 rounded-2xl font-bold text-xs hover:bg-surface-variant transition-all flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
