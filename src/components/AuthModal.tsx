import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Smartphone, Mail, UserCheck, ShieldCheck, Check } from 'lucide-react';
import { soundService } from '../services/soundService';

interface AuthModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (user: UserProfile) => void;
}

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser
}) => {
  const [authMode, setAuthMode] = useState<'options' | 'phone' | 'email' | 'profile'>('options');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [emailInput, setEmailInput] = useState(user.email || '');
  const [nameInput, setNameInput] = useState(user.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarUrl);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    soundService.playClick();
    const updated: UserProfile = {
      ...user,
      name: 'Alex Johnston',
      email: 'alex.johnston@gmail.com',
      avatarUrl: AVATARS[0],
      isGuest: false
    };
    onUpdateUser(updated);
    onClose();
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      soundService.playClick();
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = () => {
    soundService.playCorrect();
    const updated: UserProfile = {
      ...user,
      phone: phoneNumber,
      name: user.name || 'Verified User',
      isGuest: false
    };
    onUpdateUser(updated);
    onClose();
  };

  const handleGuestLogin = () => {
    soundService.playClick();
    const updated: UserProfile = {
      ...user,
      name: 'Guest Player',
      isGuest: true
    };
    onUpdateUser(updated);
    onClose();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playCorrect();
    const updated: UserProfile = {
      ...user,
      name: nameInput || 'Alex Johnston',
      email: emailInput || user.email,
      avatarUrl: selectedAvatar,
      isGuest: false
    };
    onUpdateUser(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface dark:bg-zinc-900 border border-outline-variant/50 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 text-on-surface-variant dark:text-zinc-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg text-white font-black text-2xl">
            JK
          </div>
          <h2 className="text-xl font-bold text-on-surface dark:text-zinc-100">
            {authMode === 'profile' ? 'Edit Profile & Avatar' : 'Welcome to JK Coin'}
          </h2>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
            {authMode === 'profile'
              ? 'Customize your player identity'
              : 'Sign in to sync coins, levels, and withdraw rewards.'}
          </p>
        </div>

        {/* Mode: Main Options */}
        {authMode === 'options' && (
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-primary text-on-primary py-3.5 px-4 rounded-2xl font-bold text-sm hover:shadow-lg active:scale-95 transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => setAuthMode('phone')}
              className="w-full flex items-center justify-center gap-3 bg-surface-container-high dark:bg-zinc-800 text-on-surface dark:text-zinc-200 py-3.5 px-4 rounded-2xl font-bold text-sm border border-outline-variant/40 hover:bg-surface-variant transition-all active:scale-95"
            >
              <Smartphone className="w-5 h-5 text-primary dark:text-blue-400" />
              <span>Phone OTP Sign In</span>
            </button>

            <button
              onClick={() => setAuthMode('profile')}
              className="w-full flex items-center justify-center gap-3 bg-surface-container dark:bg-zinc-800/80 text-on-surface dark:text-zinc-300 py-3 px-4 rounded-2xl font-medium text-xs hover:bg-surface-container-high transition-all"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Customize Profile & Avatar</span>
            </button>

            <div className="relative py-2 flex items-center justify-center">
              <span className="w-full border-t border-outline-variant/40 dark:border-zinc-800" />
              <span className="absolute bg-surface dark:bg-zinc-900 px-3 text-[10px] font-bold text-outline uppercase">
                OR
              </span>
            </div>

            <button
              onClick={handleGuestLogin}
              className="w-full py-2.5 text-xs text-primary dark:text-blue-400 font-bold hover:underline"
            >
              Continue as Guest
            </button>
          </div>
        )}

        {/* Mode: Phone OTP */}
        {authMode === 'phone' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 py-3 bg-surface-container dark:bg-zinc-800 border border-outline-variant/40 rounded-xl font-bold text-sm flex items-center text-on-surface dark:text-zinc-200">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="flex-1 bg-surface-container-low dark:bg-zinc-800/60 border border-outline-variant/40 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-zinc-100"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-primary-container"
                >
                  Send OTP Code
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-xs text-on-surface-variant dark:text-zinc-400">
                  Enter 6-digit OTP sent to +91 {phoneNumber}
                </p>
                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value;
                        const copy = [...otpCode];
                        copy[idx] = val;
                        setOtpCode(copy);
                      }}
                      className="w-10 h-12 text-center text-lg font-bold bg-surface-container dark:bg-zinc-800 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none dark:text-zinc-100"
                    />
                  ))}
                </div>
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-secondary-container text-on-secondary-container dark:bg-amber-500 dark:text-zinc-950 py-3 rounded-2xl font-bold text-sm shadow-md"
                >
                  Verify & Sign In
                </button>
              </div>
            )}
            <button
              onClick={() => setAuthMode('options')}
              className="w-full text-xs text-outline hover:underline pt-2"
            >
              Back to Sign In Options
            </button>
          </div>
        )}

        {/* Mode: Profile Edit */}
        {authMode === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2">
                Select Profile Avatar
              </label>
              <div className="grid grid-cols-3 gap-3">
                {AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(url)}
                    className={`relative w-16 h-16 rounded-full overflow-hidden border-2 mx-auto transition-transform ${
                      selectedAvatar === url
                        ? 'border-primary ring-4 ring-primary/20 scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                    {selectedAvatar === url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center text-white">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Alex Johnston"
                className="w-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="alex@example.com"
                className="w-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-zinc-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-primary-container"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('options')}
              className="w-full text-xs text-outline hover:underline pt-1"
            >
              Back to Options
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-[10px] text-outline dark:text-zinc-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit Encrypted Secure Session</span>
        </div>
      </div>
    </div>
  );
};
