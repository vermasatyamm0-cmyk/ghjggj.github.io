import {
  UserProfile,
  Question,
  Transaction,
  Achievement,
  RedeemRequest,
  AppNotification,
  LeaderboardUser
} from '../types';
import {
  INITIAL_QUESTIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_LEADERBOARD,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

const STORAGE_KEYS = {
  USER: 'jk_coin_user',
  QUESTIONS: 'jk_coin_questions',
  TRANSACTIONS: 'jk_coin_transactions',
  ACHIEVEMENTS: 'jk_coin_achievements',
  REDEEMS: 'jk_coin_redeems',
  NOTIFICATIONS: 'jk_coin_notifications',
  LAST_SPIN: 'jk_coin_last_spin',
  SETTINGS: 'jk_coin_settings'
};

const DEFAULT_USER: UserProfile = {
  uid: 'user_alex_101',
  name: 'Alex Johnston',
  email: 'alex.johnston@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  level: 5,
  xp: 1250,
  coins: 1250,
  streakDays: 7,
  lastLoginDate: new Date().toISOString().split('T')[0],
  title: 'Financial Pro',
  referralCode: 'JK-X9Z2-2024',
  referralsCount: 3,
  quizzesCompleted: 14,
  perfectQuizzes: 3,
  unlockedBadges: ['First Win', '7 Day Streak', 'Flawless Victory'],
  isGuest: false
};

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    type: 'daily_reward',
    title: '+50 Daily Bonus',
    amount: 50,
    timestamp: 'Today, 08:30 AM',
    dateStr: new Date().toISOString(),
    status: 'completed'
  },
  {
    id: 'tx_2',
    type: 'quiz_reward',
    title: '+100 Quiz Master',
    amount: 100,
    timestamp: 'Yesterday, 09:45 PM',
    dateStr: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed'
  },
  {
    id: 'tx_3',
    type: 'achievement_bonus',
    title: '+200 Streak Bonus',
    amount: 200,
    timestamp: '2 days ago',
    dateStr: new Date(Date.now() - 172800000).toISOString(),
    status: 'completed'
  }
];

const DEFAULT_REDEEMS: RedeemRequest[] = [
  {
    id: 'rd_1',
    userId: 'user_alex_101',
    userName: 'Alex Rivera',
    type: 'UPI',
    targetDetails: 'alex@upi',
    amountCoins: 500,
    amountINR: 50,
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'rd_2',
    userId: 'u2',
    userName: 'Sarah Chen',
    type: 'AmazonGiftCard',
    targetDetails: 'sarah.c@example.com',
    amountCoins: 1000,
    amountINR: 100,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

class StorageService {
  public getUser(): UserProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    this.saveUser(DEFAULT_USER);
    return DEFAULT_USER;
  }

  public saveUser(user: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
      // Ignore
    }
  }

  public getQuestions(): Question[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    this.saveQuestions(INITIAL_QUESTIONS);
    return INITIAL_QUESTIONS;
  }

  public saveQuestions(questions: Question[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch {
      // Ignore
    }
  }

  public addQuestion(question: Question) {
    const list = this.getQuestions();
    list.unshift(question);
    this.saveQuestions(list);
  }

  public deleteQuestion(id: string) {
    const list = this.getQuestions().filter((q) => q.id !== id);
    this.saveQuestions(list);
  }

  public getTransactions(): Transaction[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    this.saveTransactions(DEFAULT_TRANSACTIONS);
    return DEFAULT_TRANSACTIONS;
  }

  public saveTransactions(txs: Transaction[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
    } catch {
      // Ignore
    }
  }

  public addTransaction(tx: Omit<Transaction, 'id' | 'timestamp' | 'dateStr'>) {
    const txs = this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 5),
      timestamp: 'Just now',
      dateStr: new Date().toISOString()
    };
    txs.unshift(newTx);
    this.saveTransactions(txs);
  }

  public getAchievements(): Achievement[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    this.saveAchievements(INITIAL_ACHIEVEMENTS);
    return INITIAL_ACHIEVEMENTS;
  }

  public saveAchievements(achievements: Achievement[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch {
      // Ignore
    }
  }

  public getRedeemRequests(): RedeemRequest[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REDEEMS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    this.saveRedeemRequests(DEFAULT_REDEEMS);
    return DEFAULT_REDEEMS;
  }

  public saveRedeemRequests(reqs: RedeemRequest[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.REDEEMS, JSON.stringify(reqs));
    } catch {
      // Ignore
    }
  }

  public addRedeemRequest(req: Omit<RedeemRequest, 'id' | 'createdAt' | 'status'>) {
    const list = this.getRedeemRequests();
    const newReq: RedeemRequest = {
      ...req,
      id: 'rd_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    list.unshift(newReq);
    this.saveRedeemRequests(list);

    // Deduct coins from user balance
    const user = this.getUser();
    user.coins = Math.max(0, user.coins - req.amountCoins);
    this.saveUser(user);

    // Log transaction
    this.addTransaction({
      type: 'redemption',
      title: `- ${req.amountCoins} Coins (${req.type} Redemption)`,
      amount: -req.amountCoins,
      status: 'pending'
    });
  }

  public updateRedeemStatus(id: string, status: 'approved' | 'rejected') {
    const list = this.getRedeemRequests();
    const target = list.find((r) => r.id === id);
    if (target) {
      target.status = status;
      this.saveRedeemRequests(list);

      if (status === 'rejected') {
        // Refund coins if rejected
        const user = this.getUser();
        if (target.userId === user.uid) {
          user.coins += target.amountCoins;
          this.saveUser(user);
          this.addTransaction({
            type: 'redemption',
            title: `+ ${target.amountCoins} Coins (Refunded)`,
            amount: target.amountCoins,
            status: 'completed'
          });
        }
      }
    }
  }

  public getNotifications(): AppNotification[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    this.saveNotifications(INITIAL_NOTIFICATIONS);
    return INITIAL_NOTIFICATIONS;
  }

  public saveNotifications(notes: AppNotification[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notes));
    } catch {
      // Ignore
    }
  }

  public markNotificationsRead() {
    const notes = this.getNotifications().map((n) => ({ ...n, read: true }));
    this.saveNotifications(notes);
  }

  public canSpinToday(): boolean {
    const last = localStorage.getItem(STORAGE_KEYS.LAST_SPIN);
    const today = new Date().toISOString().split('T')[0];
    return last !== today;
  }

  public recordSpin() {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEYS.LAST_SPIN, today);
  }

  public getLeaderboard(): LeaderboardUser[] {
    const current = this.getUser();
    const list = [...INITIAL_LEADERBOARD];

    // Check if current user is already in top list or append
    const userInList = list.find((u) => u.uid === current.uid);
    if (!userInList) {
      list.push({
        rank: 42,
        uid: current.uid,
        name: current.name + ' (You)',
        avatarUrl: current.avatarUrl,
        xp: current.xp,
        title: current.title,
        coins: current.coins,
        isCurrentUser: true
      });
    }

    return list;
  }

  public addCoinsAndXP(
    addCoins: number,
    addXP: number,
    reasonTitle: string,
    txType: Transaction['type'] = 'quiz_reward'
  ): { levelUp: boolean; newLevel: number } {
    const user = this.getUser();
    const oldLevel = user.level;

    user.coins += addCoins;
    user.xp += addXP;

    // Level calculation formula: Level = Math.floor(XP / 250) + 1
    const newLevel = Math.floor(user.xp / 250) + 1;
    let levelUp = false;

    if (newLevel > oldLevel) {
      user.level = newLevel;
      levelUp = true;
      user.coins += 50; // Level up bonus
    }

    this.saveUser(user);

    if (addCoins !== 0) {
      this.addTransaction({
        type: txType,
        title: `${addCoins > 0 ? '+' : ''}${addCoins} ${reasonTitle}`,
        amount: addCoins,
        status: 'completed'
      });
    }

    return { levelUp, newLevel };
  }
}

export const storageService = new StorageService();
