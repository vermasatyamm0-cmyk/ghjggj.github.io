import React from 'react';
import { UserProfile, AppNotification } from '../types';
import { Sparkles, Bell, Shield, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenSchemaDoc: () => void;
  coinsAnimated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  notifications,
  onOpenNotifications,
  onOpenAuth,
  onOpenAdmin,
  onOpenSchemaDoc,
  coinsAnimated
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="w-full sticky top-0 bg-surface/85 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-outline-variant/40 dark:border-zinc-800 z-40 shadow-sm transition-colors">
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        {/* Brand & User Profile Quick Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuth}
            className="relative w-10 h-10 rounded-full bg-primary-container/20 overflow-hidden ring-2 ring-primary/20 hover:ring-primary transition-all active:scale-95 flex-shrink-0"
            title="Account & Profile"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-primary dark:text-blue-400 text-lg tracking-tight">
                JK Coin
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary dark:bg-blue-900/40 dark:text-blue-300">
                Lvl {user.level}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant dark:text-zinc-400 truncate max-w-[120px]">
              {user.isGuest ? 'Guest User' : user.name}
            </p>
          </div>
        </div>

        {/* Action Controls & Balance */}
        <div className="flex items-center gap-2">
          {/* Architecture / Firebase Schema Button */}
          <button
            onClick={onOpenSchemaDoc}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-surface-container-high dark:bg-zinc-800 text-on-surface hover:bg-surface-variant transition-colors"
            title="Firebase Architecture & Firestore Security Rules"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Architecture</span>
          </button>

          {/* Admin Panel Quick Toggle */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full bg-secondary-container/30 text-secondary dark:text-amber-300 dark:bg-amber-950/40 border border-secondary-container/40 hover:bg-secondary-container/50 transition-all active:scale-95"
            title="Open Admin Panel"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Admin</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full hover:bg-surface-container-high dark:hover:bg-zinc-800 text-on-surface-variant dark:text-zinc-300 transition-colors active:scale-90"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface dark:ring-zinc-900 animate-pulse" />
            )}
          </button>

          {/* Coin Balance Pill */}
          <div
            className={`flex items-center gap-1.5 bg-secondary-container/20 dark:bg-amber-950/40 px-3 py-1.5 rounded-full border border-secondary-container/40 dark:border-amber-800/40 shadow-sm transition-all duration-300 ${
              coinsAnimated ? 'scale-110 ring-4 ring-amber-400/30' : ''
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 animate-spin-slow" />
            <span className="font-bold text-sm text-on-secondary-container dark:text-amber-300">
              {user.coins.toLocaleString()} 🪙
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
