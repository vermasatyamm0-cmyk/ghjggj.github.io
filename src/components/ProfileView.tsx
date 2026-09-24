import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  User,
  Shield,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Vibrate,
  Globe,
  LogOut,
  Edit2,
  Trophy,
  Sparkles,
  Flame,
  Award,
  ShieldCheck,
  Check
} from 'lucide-react';
import { soundService } from '../services/soundService';

interface ProfileViewProps {
  user: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  hapticsEnabled: boolean;
  onToggleHaptics: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenSchemaDoc: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
  soundEnabled,
  onToggleSound,
  hapticsEnabled,
  onToggleHaptics,
  onOpenAuth,
  onOpenAdmin,
  onOpenSchemaDoc
}) => {
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');

  return (
    <div className="space-y-6 pb-28 max-w-7xl mx-auto px-4 pt-4 animate-fadeIn">
      {/* Profile Header Card */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-5 shadow-sm text-center sm:text-left">
        <div className="relative group flex-shrink-0">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20"
          />
          <button
            onClick={onOpenAuth}
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-on-primary shadow hover:scale-105 transition-transform"
            title="Edit Avatar & Name"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl font-bold text-on-surface dark:text-zinc-100">{user.name}</h1>
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-blue-900/40 dark:text-blue-300">
              Level {user.level}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400">{user.title}</p>
          <p className="text-xs text-outline">{user.email}</p>
        </div>

        <button
          onClick={onOpenAuth}
          className="bg-surface-container-high dark:bg-zinc-800 text-on-surface dark:text-zinc-200 px-4 py-2.5 rounded-2xl text-xs font-bold hover:bg-surface-variant transition-colors"
        >
          Edit Profile
        </button>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400 mb-1" />
          <span className="text-lg font-black text-on-surface dark:text-zinc-100">
            {user.coins.toLocaleString()}
          </span>
          <span className="text-[10px] text-on-surface-variant dark:text-zinc-400 font-semibold">
            JK Coins Balance
          </span>
        </div>

        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <Trophy className="w-5 h-5 text-primary dark:text-blue-400 mb-1" />
          <span className="text-lg font-black text-on-surface dark:text-zinc-100">
            {user.xp.toLocaleString()}
          </span>
          <span className="text-[10px] text-on-surface-variant dark:text-zinc-400 font-semibold">
            Total Player XP
          </span>
        </div>

        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500 mb-1" />
          <span className="text-lg font-black text-on-surface dark:text-zinc-100">
            {user.streakDays} Days
          </span>
          <span className="text-[10px] text-on-surface-variant dark:text-zinc-400 font-semibold">
            Daily Streak
          </span>
        </div>

        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <Award className="w-5 h-5 text-emerald-500 mb-1" />
          <span className="text-lg font-black text-on-surface dark:text-zinc-100">
            {user.quizzesCompleted}
          </span>
          <span className="text-[10px] text-on-surface-variant dark:text-zinc-400 font-semibold">
            Quizzes Completed
          </span>
        </div>
      </div>

      {/* App Settings & Controls */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-3xl p-5 space-y-3 shadow-sm">
        <h3 className="font-bold text-sm text-on-surface dark:text-zinc-100 mb-2">
          App Preferences
        </h3>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low dark:hover:bg-zinc-800/50">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <p className="text-xs font-bold text-on-surface dark:text-zinc-100">Dark Theme</p>
              <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">
                Eye-friendly dark atmosphere
              </p>
            </div>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              darkMode ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sound FX Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low dark:hover:bg-zinc-800/50">
          <div className="flex items-center gap-3">
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <VolumeX className="w-5 h-5 text-outline" />
            )}
            <div>
              <p className="text-xs font-bold text-on-surface dark:text-zinc-100">Sound Effects</p>
              <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">
                Audio feedback for quizzes & chimes
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playClick();
              onToggleSound();
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              soundEnabled ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Haptics Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low dark:hover:bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <Vibrate className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-xs font-bold text-on-surface dark:text-zinc-100">
                Haptic Vibration Feedback
              </p>
              <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">
                Touch vibrations on tap & answer
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playClick();
              onToggleHaptics();
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              hapticsEnabled ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Language selector */}
        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low dark:hover:bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs font-bold text-on-surface dark:text-zinc-100">App Language</p>
              <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">
                Select your preferred interface language
              </p>
            </div>
          </div>
          <div className="flex gap-1 bg-surface-container dark:bg-zinc-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setLanguage('English')}
              className={`px-2.5 py-1 rounded-lg ${
                language === 'English' ? 'bg-primary text-on-primary' : 'text-outline'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('Hindi')}
              className={`px-2.5 py-1 rounded-lg ${
                language === 'Hindi' ? 'bg-primary text-on-primary' : 'text-outline'
              }`}
            >
              HI
            </button>
          </div>
        </div>

        {/* Developer / Architecture Link */}
        <button
          onClick={onOpenSchemaDoc}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low dark:hover:bg-zinc-800/50 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-xs font-bold text-on-surface dark:text-zinc-100">
                Firebase & Android Architecture Specs
              </p>
              <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">
                View Firestore Collections, Rules & Security
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-primary dark:text-blue-400">&rarr;</span>
        </button>

        {/* Admin Panel Quick Link */}
        <button
          onClick={onOpenAdmin}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-secondary-container/20 text-secondary dark:text-amber-300 dark:bg-amber-950/30 border border-secondary-container/30 text-left hover:bg-secondary-container/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-xs font-bold">Admin Management Panel</p>
              <p className="text-[10px] opacity-80">Add questions, AI generator & approve rewards</p>
            </div>
          </div>
          <span className="text-xs font-bold">&rarr;</span>
        </button>
      </div>
    </div>
  );
};
