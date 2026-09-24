import React, { useState } from 'react';
import { QuizCategory, Difficulty } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialData';
import { Search, Sparkles, Shuffle, Flame } from 'lucide-react';
import { soundService } from '../services/soundService';

interface QuizCategoriesViewProps {
  onSelectCategory: (categoryId: string, difficulty?: Difficulty) => void;
  onSelectRandom: () => void;
}

export const QuizCategoriesView: React.FC<QuizCategoriesViewProps> = ({
  onSelectCategory,
  onSelectRandom
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');

  const filteredCategories = INITIAL_CATEGORIES.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCategoryClick = (catId: string) => {
    soundService.playClick();
    onSelectCategory(catId, selectedDifficulty === 'All' ? undefined : selectedDifficulty);
  };

  return (
    <div className="space-y-6 pb-28 max-w-7xl mx-auto px-4 pt-4 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface dark:text-zinc-100 tracking-tight">
            Quiz Categories
          </h1>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
            Choose a subject to expand your knowledge and win JK Coins.
          </p>
        </div>

        {/* Random Mixed Quiz Trigger */}
        <button
          onClick={() => {
            soundService.playClick();
            onSelectRandom();
          }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold px-5 py-3 rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition-all text-xs"
        >
          <Shuffle className="w-4 h-4" />
          <span>Play Mixed Challenge</span>
        </button>
      </div>

      {/* Search & Difficulty Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories (e.g. Science, Crypto, History)..."
            className="w-full bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/50 dark:border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-zinc-100"
          />
        </div>

        {/* Difficulty Pill Selector */}
        <div className="flex items-center gap-1.5 bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 p-1.5 rounded-2xl overflow-x-auto">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => {
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => {
                  soundService.playClick();
                  setSelectedDifficulty(diff);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant dark:text-zinc-400 hover:text-on-surface'
                }`}
              >
                {diff}
                {diff === 'Easy' && ' (+10🪙)'}
                {diff === 'Medium' && ' (+15🪙)'}
                {diff === 'Hard' && ' (+25🪙)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat: QuizCategory) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-3xl p-5 space-y-3 cursor-pointer hover:shadow-lg hover:border-primary/40 dark:hover:border-blue-500/40 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-md ${cat.color}`}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                {cat.tag && (
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    {cat.tag}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base text-on-surface dark:text-zinc-100 group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1 line-clamp-2">
                {cat.description}
              </p>
            </div>

            <div className="pt-2 border-t border-outline-variant/30 dark:border-zinc-800/80 flex justify-between items-center text-xs font-semibold text-on-surface-variant dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{cat.activeCount.toLocaleString()} Active Players</span>
              </span>
              <span className="text-primary dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                Play &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
