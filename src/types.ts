export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type QuestionType = 'MCQ' | 'TrueFalse' | 'Image';

export interface Question {
  id: string;
  category: string;
  questionText: string;
  type: QuestionType;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: Difficulty;
  rewardCoins: number;
  imageUrl?: string;
  hint?: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon name or emoji
  activeCount: number;
  tag?: string;
  color: string;
  description: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  level: number;
  xp: number;
  coins: number;
  streakDays: number;
  lastLoginDate: string; // YYYY-MM-DD
  title: string;
  referralCode: string;
  referralsCount: number;
  quizzesCompleted: number;
  perfectQuizzes: number;
  unlockedBadges: string[];
  isGuest?: boolean;
}

export interface Transaction {
  id: string;
  type: 'daily_reward' | 'quiz_reward' | 'achievement_bonus' | 'referral_bonus' | 'spin_win' | 'redemption';
  title: string;
  amount: number; // positive or negative
  timestamp: string;
  dateStr: string;
  status: 'completed' | 'pending' | 'rejected';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'quiz' | 'streak' | 'coins' | 'social';
  targetCount: number;
  currentCount: number;
  unlocked: boolean;
  rewardCoins: number;
}

export interface LeaderboardUser {
  rank: number;
  uid: string;
  name: string;
  avatarUrl: string;
  xp: number;
  title: string;
  coins: number;
  isCurrentUser?: boolean;
}

export interface RedeemRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'UPI' | 'Paytm' | 'AmazonGiftCard' | 'GooglePlay';
  targetDetails: string; // UPI ID, Phone Number, or Email
  amountCoins: number;
  amountINR: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'reward' | 'challenge' | 'achievement' | 'system';
  read: boolean;
  actionUrl?: string;
}
