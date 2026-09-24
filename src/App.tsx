import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Question,
  Transaction,
  Achievement,
  RedeemRequest,
  AppNotification,
  Difficulty
} from './types';
import { storageService } from './services/storageService';
import { soundService } from './services/soundService';

import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { SplashScreen } from './components/SplashScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { QuizCategoriesView } from './components/QuizCategoriesView';
import { QuizEngine } from './components/QuizEngine';
import { QuizResultModal } from './components/QuizResultModal';
import { DailySpinWheel } from './components/DailySpinWheel';
import { WalletView } from './components/WalletView';
import { LeaderboardView } from './components/LeaderboardView';
import { RewardsView } from './components/RewardsView';
import { ReferralView } from './components/ReferralView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { NotificationCenter } from './components/NotificationCenter';
import { FirestoreSchemaModal } from './components/FirestoreSchemaModal';

export const App: React.FC = () => {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showSplash, setShowSplash] = useState(true);

  // User & Data state
  const [user, setUser] = useState<UserProfile>(() => storageService.getUser());
  const [questions, setQuestions] = useState<Question[]>(() => storageService.getQuestions());
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    storageService.getTransactions()
  );
  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    storageService.getAchievements()
  );
  const [redeemRequests, setRedeemRequests] = useState<RedeemRequest[]>(() =>
    storageService.getRedeemRequests()
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    storageService.getNotifications()
  );

  // Active Quiz State
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[] | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState<string>('General Knowledge');
  const [quizResults, setQuizResults] = useState<{
    totalQuestions: number;
    correctCount: number;
    coinsEarned: number;
    xpEarned: number;
    timeTakenSeconds: number;
  } | null>(null);

  // Modals & Popups
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSchemaDocOpen, setIsSchemaDocOpen] = useState(false);
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [hasClaimedDaily, setHasClaimedDaily] = useState(false);

  // UI Preferences
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [coinsAnimated, setCoinsAnimated] = useState(false);

  // Apply Dark Mode Class to HTML Element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const triggerCoinsAnimation = () => {
    setCoinsAnimated(true);
    setTimeout(() => setCoinsAnimated(false), 800);
  };

  // Start a Quiz Session
  const handleStartQuiz = (categoryId?: string, difficulty?: Difficulty) => {
    let pool = questions;
    let name = 'General Knowledge';

    if (categoryId) {
      pool = questions.filter((q) => q.category === categoryId);
      if (pool.length === 0) pool = questions; // Fallback to all questions
      name = categoryId.replace('_', ' ').toUpperCase();
    }

    if (difficulty) {
      const filteredByDiff = pool.filter((q) => q.difficulty === difficulty);
      if (filteredByDiff.length > 0) pool = filteredByDiff;
    }

    // Shuffle and pick top 5
    const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);

    soundService.playClick();
    setActiveCategoryName(name);
    setActiveQuizQuestions(selected);
    setQuizResults(null);
  };

  const handleFinishQuiz = (results: {
    totalQuestions: number;
    correctCount: number;
    coinsEarned: number;
    xpEarned: number;
    timeTakenSeconds: number;
  }) => {
    // Add coins and XP to storage
    const { levelUp } = storageService.addCoinsAndXP(
      results.coinsEarned,
      results.xpEarned,
      'Quiz Master Reward',
      'quiz_reward'
    );

    // Refresh user & state
    const updatedUser = storageService.getUser();
    updatedUser.quizzesCompleted += 1;
    if (results.correctCount === results.totalQuestions) {
      updatedUser.perfectQuizzes += 1;
    }
    storageService.saveUser(updatedUser);

    setUser(updatedUser);
    setTransactions(storageService.getTransactions());
    setQuizResults(results);
    triggerCoinsAnimation();
  };

  const handleClaimDailyBonus = () => {
    if (hasClaimedDaily) return;
    storageService.addCoinsAndXP(50, 50, 'Daily Login Reward', 'daily_reward');

    const updatedUser = storageService.getUser();
    setUser(updatedUser);
    setTransactions(storageService.getTransactions());
    setHasClaimedDaily(true);
    triggerCoinsAnimation();
  };

  const handleSpinRewardClaimed = (coins: number, title: string) => {
    storageService.addCoinsAndXP(coins, coins * 2, title, 'spin_win');
    storageService.recordSpin();

    setUser(storageService.getUser());
    setTransactions(storageService.getTransactions());
    setIsSpinWheelOpen(false);
    triggerCoinsAnimation();
  };

  const handleAddRedeemRequest = (req: Omit<RedeemRequest, 'id' | 'createdAt' | 'status'>) => {
    storageService.addRedeemRequest(req);
    setUser(storageService.getUser());
    setRedeemRequests(storageService.getRedeemRequests());
    setTransactions(storageService.getTransactions());
  };

  const handleUpdateRedeemStatus = (id: string, status: 'approved' | 'rejected') => {
    storageService.updateRedeemStatus(id, status);
    setUser(storageService.getUser());
    setRedeemRequests(storageService.getRedeemRequests());
    setTransactions(storageService.getTransactions());
  };

  const handleAddQuestion = (q: Question) => {
    storageService.addQuestion(q);
    setQuestions(storageService.getQuestions());
  };

  const handleDeleteQuestion = (id: string) => {
    storageService.deleteQuestion(id);
    setQuestions(storageService.getQuestions());
  };

  const handleClaimAchievement = (achId: string) => {
    const list = achievements.map((a) => (a.id === achId ? { ...a, unlocked: true } : a));
    storageService.saveAchievements(list);
    setAchievements(list);

    const target = achievements.find((a) => a.id === achId);
    if (target) {
      storageService.addCoinsAndXP(target.rewardCoins, 100, `Badge: ${target.title}`, 'achievement_bonus');
      setUser(storageService.getUser());
      setTransactions(storageService.getTransactions());
      triggerCoinsAnimation();
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface dark:bg-zinc-950 dark:text-zinc-100 flex flex-col font-sans transition-colors selection:bg-primary/20">
      {/* App Header */}
      <Header
        user={user}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSchemaDoc={() => setIsSchemaDocOpen(true)}
        coinsAnimated={coinsAnimated}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {/* Active Quiz Overlay Mode */}
        {activeQuizQuestions ? (
          <QuizEngine
            questions={activeQuizQuestions}
            categoryName={activeCategoryName}
            onFinishQuiz={handleFinishQuiz}
            onCancel={() => setActiveQuizQuestions(null)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeDashboard
                user={user}
                onStartQuiz={(cat) => handleStartQuiz(cat)}
                onClaimDailyBonus={handleClaimDailyBonus}
                onNavigateTab={(tab) => {
                  soundService.playClick();
                  setActiveTab(tab);
                }}
                hasClaimedDaily={hasClaimedDaily}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizCategoriesView
                onSelectCategory={(catId, diff) => handleStartQuiz(catId, diff)}
                onSelectRandom={() => handleStartQuiz()}
              />
            )}

            {activeTab === 'wallet' && (
              <WalletView
                user={user}
                transactions={transactions}
                redeemRequests={redeemRequests}
                onAddRedeemRequest={handleAddRedeemRequest}
                onNavigateTab={(tab) => {
                  soundService.playClick();
                  if (tab === 'rewards') setActiveTab('rewards');
                }}
              />
            )}

            {activeTab === 'leaderboard' && (
              <LeaderboardView user={user} leaderboardUsers={storageService.getLeaderboard()} />
            )}

            {activeTab === 'rewards' && (
              <RewardsView
                user={user}
                achievements={achievements}
                onClaimAchievement={handleClaimAchievement}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenSpinWheel={() => setIsSpinWheelOpen(true)}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                soundEnabled={soundEnabled}
                onToggleSound={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  soundService.setSoundEnabled(next);
                }}
                hapticsEnabled={hapticsEnabled}
                onToggleHaptics={() => {
                  const next = !hapticsEnabled;
                  setHapticsEnabled(next);
                  soundService.setHapticsEnabled(next);
                }}
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onOpenSchemaDoc={() => setIsSchemaDocOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Floating Navigation */}
      {!activeQuizQuestions && (
        <Navigation
          activeTab={activeTab}
          onSelectTab={(tab) => {
            soundService.playClick();
            setActiveTab(tab);
          }}
        />
      )}

      {/* Modals & Dialogs */}
      {quizResults && (
        <QuizResultModal
          results={quizResults}
          onPlayAgain={() => {
            setQuizResults(null);
            handleStartQuiz();
          }}
          onGoHome={() => {
            setQuizResults(null);
            setActiveQuizQuestions(null);
            setActiveTab('home');
          }}
        />
      )}

      {isSpinWheelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-lg bg-surface dark:bg-zinc-900 border border-amber-500/30 rounded-3xl p-4 shadow-2xl">
            <button
              onClick={() => setIsSpinWheelOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container text-outline z-30"
            >
              ✕
            </button>
            <DailySpinWheel
              canSpin={storageService.canSpinToday()}
              onRewardClaimed={handleSpinRewardClaimed}
            />
          </div>
        </div>
      )}

      <AuthModal
        user={user}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onUpdateUser={(u) => {
          storageService.saveUser(u);
          setUser(u);
        }}
      />

      {isAdminOpen && (
        <AdminPanel
          questions={questions}
          redeemRequests={redeemRequests}
          onAddQuestion={handleAddQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateRedeemStatus={handleUpdateRedeemStatus}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {isNotificationsOpen && (
        <NotificationCenter
          notifications={notifications}
          onMarkAllRead={() => {
            storageService.markNotificationsRead();
            setNotifications(storageService.getNotifications());
          }}
          onClose={() => setIsNotificationsOpen(false)}
        />
      )}

      {isSchemaDocOpen && (
        <FirestoreSchemaModal onClose={() => setIsSchemaDocOpen(false)} />
      )}
    </div>
  );
};
