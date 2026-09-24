import React from 'react';
import { AppNotification } from '../types';
import { Bell, CheckCheck, Gift, Trophy, ShieldAlert, X } from 'lucide-react';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAllRead,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface dark:bg-zinc-900 border border-outline-variant/50 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-outline-variant/30 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary dark:text-blue-400" />
            <h2 className="text-lg font-bold text-on-surface dark:text-zinc-100">
              Notifications & Alerts
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs font-bold text-primary dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-surface-container text-outline"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                !n.read
                  ? 'bg-primary/5 dark:bg-blue-950/30 border-primary/30'
                  : 'bg-surface-container-lowest dark:bg-zinc-800/60 border-outline-variant/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-surface-container dark:bg-zinc-800 text-amber-500 mt-0.5">
                  {n.type === 'reward' && <Gift className="w-4 h-4" />}
                  {n.type === 'achievement' && <Trophy className="w-4 h-4" />}
                  {n.type === 'system' && <ShieldAlert className="w-4 h-4" />}
                  {n.type === 'challenge' && <Bell className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-xs text-on-surface dark:text-zinc-100">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-outline">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-0.5">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
