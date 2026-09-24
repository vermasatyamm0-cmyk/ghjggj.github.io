import React, { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing brain modules...');

  const phrases = [
    'Initializing brain modules...',
    'Fetching latest quiz packs...',
    'Securing user wallet & coin rules...',
    'Ready to reward your knowledge!'
  ];

  useEffect(() => {
    let phraseIdx = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 400);
          return 100;
        }
        const next = prev + Math.random() * 18 + 5;
        if (next > 30 && phraseIdx < 1) {
          phraseIdx = 1;
          setLoadingText(phrases[1]);
        } else if (next > 60 && phraseIdx < 2) {
          phraseIdx = 2;
          setLoadingText(phrases[2]);
        } else if (next > 85 && phraseIdx < 3) {
          phraseIdx = 3;
          setLoadingText(phrases[3]);
        }
        return next > 100 ? 100 : next;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-background via-surface-bright to-primary-fixed/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900 flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-64 h-64 bg-primary/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Top spacer */}
      <div />

      {/* Center Hero */}
      <div className="flex flex-col items-center text-center max-w-sm w-full relative z-10">
        {/* Animated Pulse Rings & Golden Coin Icon */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute w-56 h-56 border-2 border-amber-400/30 rounded-full animate-ping opacity-25" />
          <div className="absolute w-44 h-44 border-2 border-primary/30 rounded-full animate-pulse opacity-40" />

          {/* Golden Coin Graphic */}
          <div className="relative z-20 w-36 h-36 md:w-44 md:h-44 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 rounded-full shadow-[0_20px_50px_rgba(217,119,6,0.35)] flex items-center justify-center p-2 transform hover:scale-105 transition-transform duration-500">
            <div className="w-full h-full rounded-full border-4 border-amber-200/60 bg-gradient-to-br from-amber-500 to-amber-700 flex flex-col items-center justify-center text-white shadow-inner">
              <Sparkles className="w-12 h-12 text-yellow-100 animate-bounce mb-1" />
              <span className="font-extrabold text-2xl tracking-tight text-yellow-100 drop-shadow">
                JK COIN
              </span>
            </div>
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="text-3xl md:text-4xl font-black text-primary dark:text-blue-400 tracking-tight mb-2">
          JK Coin
        </h1>
        <p className="text-lg font-medium text-on-surface-variant dark:text-zinc-300 flex items-center justify-center gap-2">
          <span>Play</span>
          <span className="text-amber-500 font-bold">•</span>
          <span>Learn</span>
          <span className="text-amber-500 font-bold">•</span>
          <span>Earn</span>
        </p>

        {/* Progress Bar */}
        <div className="mt-8 w-full px-6">
          <div className="h-2.5 w-full bg-surface-container dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-primary via-amber-400 to-amber-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-xs font-semibold text-outline dark:text-zinc-400">
            {loadingText}
          </p>
        </div>
      </div>

      {/* Footer info */}
      <div className="relative z-10 flex flex-col items-center gap-1 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/70 dark:text-zinc-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Secure Financial Education & Quiz Engine</span>
        </div>
        <span className="text-[10px] text-outline/60 dark:text-zinc-500 tracking-widest uppercase">
          POWERED BY JK LABS
        </span>
      </div>
    </div>
  );
};
