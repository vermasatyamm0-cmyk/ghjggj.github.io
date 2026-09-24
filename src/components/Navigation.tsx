import React from 'react';
import { Home, Layers, Wallet, Trophy, Gift, User } from 'lucide-react';

export type TabType = 'home' | 'quiz' | 'wallet' | 'leaderboard' | 'rewards' | 'profile';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'quiz', label: 'Quizzes', icon: <Layers className="w-5 h-5" /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Rank', icon: <Trophy className="w-5 h-5" /> },
    { id: 'rewards', label: 'Rewards', icon: <Gift className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 bg-surface/90 dark:bg-zinc-900/90 backdrop-blur-lg border-t border-outline-variant/30 dark:border-zinc-800 px-2 pt-2 pb-safe-offset-2 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center transition-all duration-300 py-1.5 px-3 rounded-full active:scale-90 ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container dark:bg-amber-500 dark:text-zinc-950 font-bold shadow-md'
                  : 'text-on-surface-variant dark:text-zinc-400 opacity-70 hover:opacity-100 hover:text-primary'
              }`}
            >
              {item.icon}
              <span className="text-[11px] font-medium mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
