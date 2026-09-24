import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question } from '../types';
import { soundService } from '../services/soundService';
import {
  Clock,
  Sparkles,
  HelpCircle,
  EyeOff,
  SkipForward,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight
} from 'lucide-react';

interface QuizEngineProps {
  questions: Question[];
  categoryName: string;
  onFinishQuiz: (results: {
    totalQuestions: number;
    correctCount: number;
    coinsEarned: number;
    xpEarned: number;
    timeTakenSeconds: number;
  }) => void;
  onCancel: () => void;
}

const QUESTION_TIMER_SECONDS = 20;

export const QuizEngine: React.FC<QuizEngineProps> = ({
  questions,
  categoryName,
  onFinishQuiz,
  onCancel
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER_SECONDS);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [used5050, setUsed5050] = useState(false);
  const [usedSkip, setUsedSkip] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Score stats
  const [correctCount, setCorrectCount] = useState(0);
  const [coinsAccumulated, setCoinsAccumulated] = useState(0);
  const [xpAccumulated, setXpAccumulated] = useState(0);
  const [streakCount, setStreakCount] = useState(0);

  const startTimeRef = useRef(Date.now());
  const currentQuestion = questions[currentIndex];

  const handleTimeOut = useCallback(() => {
    if (isAnswered) return;
    soundService.playWrong();
    setIsAnswered(true);
    setSelectedOption(-1); // Timeout
    setStreakCount(0);
  }, [isAnswered]);

  // Timer Countdown Effect
  useEffect(() => {
    if (isAnswered) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered, handleTimeOut]);

  if (!currentQuestion) {
    return (
      <div className="p-8 text-center text-on-surface dark:text-zinc-100">
        No questions available for this quiz set.
      </div>
    );
  }

  const handleSelectOption = (index: number) => {
    if (isAnswered || hiddenOptions.includes(index)) return;

    soundService.playClick();
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctAnswerIndex;

    if (isCorrect) {
      soundService.playCorrect();
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);

      const streakBonus = newStreak >= 3 ? 5 : 0;
      const questionCoins = currentQuestion.rewardCoins + streakBonus;
      const questionXP = currentQuestion.rewardCoins * 2 + 10;

      setCorrectCount((prev) => prev + 1);
      setCoinsAccumulated((prev) => prev + questionCoins);
      setXpAccumulated((prev) => prev + questionXP);
    } else {
      soundService.playWrong();
      setStreakCount(0);
    }
  };

  const handleNextQuestion = () => {
    soundService.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(QUESTION_TIMER_SECONDS);
      setHiddenOptions([]);
      setShowHint(false);
    } else {
      // Finish Quiz
      const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000);
      onFinishQuiz({
        totalQuestions: questions.length,
        correctCount,
        coinsEarned: coinsAccumulated,
        xpEarned: xpAccumulated,
        timeTakenSeconds: totalTime
      });
    }
  };

  const handleUse5050 = () => {
    if (used5050 || isAnswered) return;
    soundService.playClick();
    setUsed5050(true);

    const correctIdx = currentQuestion.correctAnswerIndex;
    const wrongIndices = currentQuestion.options
      .map((_, i) => i)
      .filter((i) => i !== correctIdx);

    // Pick 2 wrong indices randomly to hide
    const toHide = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenOptions(toHide);
  };

  const handleUseSkip = () => {
    if (usedSkip || isAnswered) return;
    soundService.playClick();
    setUsedSkip(true);
    handleNextQuestion();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Quiz Top Control Bar */}
      <div className="flex items-center justify-between bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 p-4 rounded-3xl shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary dark:text-blue-400">
            {categoryName}
          </span>
          <h3 className="font-bold text-sm text-on-surface dark:text-zinc-100">
            Question {currentIndex + 1} of {questions.length}
          </h3>
        </div>

        {/* Streak Counter */}
        {streakCount >= 2 && (
          <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1 rounded-full border border-amber-500/30 animate-bounce">
            <Zap className="w-3.5 h-3.5 fill-amber-500" />
            <span>{streakCount}x Streak!</span>
          </div>
        )}

        {/* Quit Quiz Trigger */}
        <button
          onClick={onCancel}
          className="text-xs font-bold text-outline dark:text-zinc-400 hover:text-error transition-colors"
        >
          Quit Quiz
        </button>
      </div>

      {/* Timer Progress Ring & Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="flex items-center gap-1.5 text-on-surface-variant dark:text-zinc-400">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Time Remaining</span>
          </span>
          <span
            className={`text-sm font-extrabold ${
              timeLeft <= 5 ? 'text-error animate-ping' : 'text-primary dark:text-blue-400'
            }`}
          >
            {timeLeft}s
          </span>
        </div>
        <div className="h-2.5 w-full bg-surface-container dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              timeLeft <= 5 ? 'bg-error' : 'bg-gradient-to-r from-primary to-amber-500'
            }`}
            style={{ width: `${(timeLeft / QUESTION_TIMER_SECONDS) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-3xl p-6 shadow-md space-y-4">
        {/* Difficulty Badge */}
        <div className="flex justify-between items-center">
          <span
            className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
              currentQuestion.difficulty === 'Easy'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : currentQuestion.difficulty === 'Medium'
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
            }`}
          >
            {currentQuestion.difficulty} (+{currentQuestion.rewardCoins} 🪙)
          </span>

          <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>Reward: {currentQuestion.rewardCoins} JKC</span>
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg md:text-xl font-extrabold text-on-surface dark:text-zinc-100 leading-snug">
          {currentQuestion.questionText}
        </h2>

        {/* Image Question handling if exists */}
        {currentQuestion.imageUrl && (
          <div className="rounded-2xl overflow-hidden max-h-48 border border-outline-variant/30">
            <img
              src={currentQuestion.imageUrl}
              alt="Quiz graphic"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Lifelines Bar */}
        <div className="pt-2 flex gap-2 border-t border-outline-variant/30 dark:border-zinc-800">
          <button
            onClick={handleUse5050}
            disabled={used5050 || isAnswered}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              used5050
                ? 'opacity-40 border-outline-variant bg-surface-container dark:bg-zinc-800'
                : 'border-primary/30 text-primary dark:text-blue-400 hover:bg-primary/10'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>50:50</span>
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              setShowHint(!showHint);
            }}
            disabled={isAnswered}
            className="flex-1 py-2 px-3 rounded-xl border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-500/10 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hint</span>
          </button>

          <button
            onClick={handleUseSkip}
            disabled={usedSkip || isAnswered}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              usedSkip
                ? 'opacity-40 border-outline-variant bg-surface-container dark:bg-zinc-800'
                : 'border-secondary/30 text-secondary dark:text-amber-300 hover:bg-secondary/10'
            }`}
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Skip</span>
          </button>
        </div>

        {/* Hint Callout Box */}
        {showHint && currentQuestion.hint && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-800 dark:text-amber-300 animate-fadeIn">
            <span className="font-bold">💡 Hint: </span>
            {currentQuestion.hint}
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, idx) => {
          const isHidden = hiddenOptions.includes(idx);
          if (isHidden) return null;

          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentQuestion.correctAnswerIndex;

          let btnStyle =
            'bg-surface-container-lowest dark:bg-zinc-900 border-outline-variant/50 dark:border-zinc-800 text-on-surface dark:text-zinc-100 hover:border-primary';

          if (isAnswered) {
            if (isCorrect) {
              btnStyle =
                'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
            } else if (isSelected) {
              btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
            } else {
              btnStyle = 'opacity-40 border-outline-variant dark:border-zinc-800';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-2xl border text-left font-medium text-sm flex items-center justify-between transition-all duration-200 active:scale-[0.99] ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-surface-container dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-outline">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </div>

              {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {isAnswered && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Banner & Next Trigger */}
      {isAnswered && (
        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-primary/30 rounded-3xl p-5 space-y-4 shadow-lg animate-fadeIn">
          <div>
            <h4 className="font-bold text-sm text-primary dark:text-blue-400 mb-1">
              Explanation
            </h4>
            <p className="text-xs text-on-surface-variant dark:text-zinc-300 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>

          <button
            onClick={handleNextQuestion}
            className="w-full bg-primary text-on-primary py-3.5 rounded-2xl font-bold text-sm shadow-md hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>
              {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
