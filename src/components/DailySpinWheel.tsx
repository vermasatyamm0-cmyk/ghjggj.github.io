import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, RotateCcw, CheckCircle2, Award } from 'lucide-react';
import { soundService } from '../services/soundService';

interface DailySpinWheelProps {
  canSpin: boolean;
  onRewardClaimed: (coins: number, title: string) => void;
}

interface Prize {
  label: string;
  coins: number;
  color: string;
  textColor: string;
}

const PRIZES: Prize[] = [
  { label: '50 🪙', coins: 50, color: '#f59e0b', textColor: '#ffffff' },
  { label: '100 🪙', coins: 100, color: '#3b82f6', textColor: '#ffffff' },
  { label: '25 🪙', coins: 25, color: '#10b981', textColor: '#ffffff' },
  { label: '200 🪙', coins: 200, color: '#8b5cf6', textColor: '#ffffff' },
  { label: '10 🪙', coins: 10, color: '#ec4899', textColor: '#ffffff' },
  { label: '150 🪙', coins: 150, color: '#f97316', textColor: '#ffffff' },
  { label: 'Bonus 🪙', coins: 75, color: '#14b8a6', textColor: '#ffffff' },
  { label: 'Jackpot 🪙', coins: 300, color: '#eab308', textColor: '#000000' }
];

export const DailySpinWheel: React.FC<DailySpinWheelProps> = ({ canSpin, onRewardClaimed }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  const handleSpin = () => {
    if (isSpinning || !canSpin) return;

    soundService.playClick();
    setIsSpinning(true);
    setWonPrize(null);

    // Random prize index 0..7
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const sliceAngle = 360 / PRIZES.length;

    // Extra spins (e.g. 5 full rotations = 1800 deg)
    const extraTurns = 5 * 360;
    // Align wheel so target prize lands under top pointer (270 deg)
    const targetAngle = extraTurns + (360 - prizeIndex * sliceAngle - sliceAngle / 2);

    const newTotalRotation = rotation + targetAngle;
    setRotation(newTotalRotation);

    // Play tick sound interval
    const soundInterval = setInterval(() => {
      soundService.playSpinTick();
    }, 150);

    setTimeout(() => {
      clearInterval(soundInterval);
      setIsSpinning(false);
      const prize = PRIZES[prizeIndex];
      setWonPrize(prize);

      soundService.playFanfare();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 4000);
  };

  const handleClaimReward = () => {
    if (!wonPrize) return;
    soundService.playCoin();
    onRewardClaimed(wonPrize.coins, `Lucky Spin Winner (${wonPrize.label})`);
    setWonPrize(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center animate-fadeIn pb-28">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold text-xs mb-2">
          <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
          <span>DAILY LUCKY WHEEL</span>
        </div>
        <h1 className="text-2xl font-black text-on-surface dark:text-zinc-100 tracking-tight">
          Spin & Win JK Coins
        </h1>
        <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
          Spin the wheel every 24 hours to win up to 300 free JK Coins!
        </p>
      </div>

      {/* Wheel Graphic Container */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto flex items-center justify-center">
        {/* Top Pointer Needle */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-amber-500 drop-shadow-md animate-pulse" />

        {/* Wheel Disk SVG */}
        <div
          className="w-full h-full rounded-full border-8 border-amber-400 dark:border-amber-500 shadow-[0_15px_40px_rgba(245,158,11,0.3)] transition-transform ease-out overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? '4000ms' : '0ms'
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {PRIZES.map((prize, idx) => {
              const slice = 360 / PRIZES.length;
              const startAngle = idx * slice;
              const endAngle = (idx + 1) * slice;

              const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
              const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
              const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
              const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

              const textAngle = startAngle + slice / 2;
              const textX = 50 + 32 * Math.cos((Math.PI * textAngle) / 180);
              const textY = 50 + 32 * Math.sin((Math.PI * textAngle) / 180);

              return (
                <g key={idx}>
                  <path d={pathData} fill={prize.color} stroke="#ffffff" strokeWidth="0.8" />
                  <text
                    x={textX}
                    y={textY}
                    fill={prize.textColor}
                    fontSize="4"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                  >
                    {prize.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Center Hub */}
        <div className="absolute z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 border-4 border-white dark:border-zinc-900 shadow-xl flex items-center justify-center">
          <Award className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Spin Action Button */}
      <div>
        <button
          onClick={handleSpin}
          disabled={isSpinning || !canSpin}
          className={`w-full py-4 rounded-2xl font-black text-base shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
            !canSpin
              ? 'bg-surface-container-high text-outline dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-zinc-950 hover:brightness-110'
          }`}
        >
          {isSpinning ? (
            <span>Spinning...</span>
          ) : !canSpin ? (
            <span>Already Spun Today (Come back tomorrow)</span>
          ) : (
            <>
              <RotateCcw className="w-5 h-5 animate-spin-slow" />
              <span>SPIN NOW (FREE)</span>
            </>
          )}
        </button>
      </div>

      {/* Prize Win Modal */}
      {wonPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-surface dark:bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full mx-auto flex items-center justify-center shadow-inner">
              <Gift className="w-10 h-10 animate-bounce" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-on-surface dark:text-zinc-100">
                You Won {wonPrize.label}! 🎉
              </h2>
              <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
                +{wonPrize.coins} JK Coins added directly to your virtual wallet balance.
              </p>
            </div>
            <button
              onClick={handleClaimReward}
              className="w-full bg-amber-500 text-zinc-950 font-bold py-3.5 rounded-2xl shadow-lg hover:bg-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Claim {wonPrize.coins} Coins</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
