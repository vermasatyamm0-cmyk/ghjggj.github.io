import React, { useState } from 'react';
import { X, Shield, Code, Server, Smartphone, Copy, Check } from 'lucide-react';

interface FirestoreSchemaModalProps {
  onClose: () => void;
}

const FIRESTORE_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['coins', 'isAdmin']);
    }

    // Questions Catalog
    match /questions/{questionId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Transactions Log (Write via Cloud Functions / Server)
    match /transactions/{transactionId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if false; // Only Cloud Functions can append coins log
    }

    // Redeem Payout Claims
    match /redeem_requests/{requestId} {
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}`;

const FIRESTORE_COLLECTIONS_JSON = `{
  "collections": {
    "users": {
      "uid": "string (Primary Key)",
      "name": "string",
      "email": "string",
      "phone": "string optional",
      "avatarUrl": "string",
      "level": "number (default 1)",
      "xp": "number (default 0)",
      "coins": "number (default 100)",
      "streakDays": "number",
      "lastLoginDate": "string YYYY-MM-DD",
      "referralCode": "string",
      "unlockedBadges": "array<string>",
      "isAdmin": "boolean"
    },
    "questions": {
      "id": "string",
      "category": "string",
      "questionText": "string",
      "type": "string (MCQ | TrueFalse | Image)",
      "options": "array<string>",
      "correctAnswerIndex": "number",
      "explanation": "string",
      "difficulty": "string (Easy | Medium | Hard)",
      "rewardCoins": "number",
      "hint": "string"
    },
    "redeem_requests": {
      "id": "string",
      "userId": "string",
      "type": "string (UPI | Paytm | AmazonGiftCard | GooglePlay)",
      "targetDetails": "string",
      "amountCoins": "number",
      "amountINR": "number",
      "status": "string (pending | approved | rejected)",
      "createdAt": "timestamp"
    }
  }
}`;

export const FirestoreSchemaModal: React.FC<FirestoreSchemaModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'schema' | 'functions' | 'android'>('rules');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface dark:bg-zinc-900 border border-outline-variant/50 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 my-auto">
        <div className="flex justify-between items-center border-b border-outline-variant/30 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-500" />
            <div>
              <h2 className="text-xl font-black text-on-surface dark:text-zinc-100">
                Firebase Architecture & Security Specifications
              </h2>
              <p className="text-xs text-on-surface-variant dark:text-zinc-400">
                Production-ready Firestore collections, security rules & anti-cheat architecture.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container text-outline"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex gap-2 border-b border-outline-variant/30 text-xs font-bold pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'rules'
                ? 'bg-primary text-on-primary'
                : 'text-outline hover:bg-surface-container'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Firestore Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'schema'
                ? 'bg-primary text-on-primary'
                : 'text-outline hover:bg-surface-container'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Firestore Schema</span>
          </button>

          <button
            onClick={() => setActiveTab('functions')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'functions'
                ? 'bg-primary text-on-primary'
                : 'text-outline hover:bg-surface-container'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Cloud Functions</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'android'
                ? 'bg-primary text-on-primary'
                : 'text-outline hover:bg-surface-container'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android Production</span>
          </button>
        </div>

        {/* Tab 1: Rules */}
        {activeTab === 'rules' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface dark:text-zinc-200">
                firestore.rules (Anti-Coin Cheating Security Rules)
              </span>
              <button
                onClick={() => handleCopy(FIRESTORE_RULES)}
                className="text-xs font-bold text-primary dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Rules'}</span>
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 text-emerald-400 rounded-2xl text-xs font-mono overflow-x-auto max-h-72 border border-zinc-800">
              {FIRESTORE_RULES}
            </pre>
          </div>
        )}

        {/* Tab 2: Schema */}
        {activeTab === 'schema' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface dark:text-zinc-200">
                Firestore Collections Blueprint (JSON Schema)
              </span>
              <button
                onClick={() => handleCopy(FIRESTORE_COLLECTIONS_JSON)}
                className="text-xs font-bold text-primary dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Schema'}</span>
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 text-blue-300 rounded-2xl text-xs font-mono overflow-x-auto max-h-72 border border-zinc-800">
              {FIRESTORE_COLLECTIONS_JSON}
            </pre>
          </div>
        )}

        {/* Tab 3: Cloud Functions */}
        {activeTab === 'functions' && (
          <div className="space-y-3 text-xs text-on-surface-variant dark:text-zinc-300 leading-relaxed">
            <h4 className="font-bold text-sm text-on-surface dark:text-zinc-100">
              Anti-Cheat Cloud Functions Triggers
            </h4>
            <div className="p-4 bg-surface-container-lowest dark:bg-zinc-800 border border-outline-variant/30 rounded-2xl space-y-2">
              <p className="font-bold text-primary dark:text-blue-400">1. verifyQuizSubmission</p>
              <p>
                Validates client submission time & answers on server. Prevents modified local JS client state from artificially inflating JK Coin awards.
              </p>
            </div>

            <div className="p-4 bg-surface-container-lowest dark:bg-zinc-800 border border-outline-variant/30 rounded-2xl space-y-2">
              <p className="font-bold text-amber-500">2. processDailySpinReward</p>
              <p>
                Server-enforced 24-hour rate limiting using server time, stopping device clock manipulation cheats.
              </p>
            </div>

            <div className="p-4 bg-surface-container-lowest dark:bg-zinc-800 border border-outline-variant/30 rounded-2xl space-y-2">
              <p className="font-bold text-emerald-500">3. processPayoutApproval</p>
              <p>
                Triggers automatic UPI payment gateway dispatch (RazorpayX / Cashfree) upon admin approval in the Admin Panel.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Android Release */}
        {activeTab === 'android' && (
          <div className="space-y-3 text-xs text-on-surface-variant dark:text-zinc-300 leading-relaxed">
            <h4 className="font-bold text-sm text-on-surface dark:text-zinc-100">
              Android Production Build Checklist
            </h4>
            <ul className="list-disc list-inside space-y-1.5 p-4 bg-surface-container-lowest dark:bg-zinc-800 border border-outline-variant/30 rounded-2xl font-mono">
              <li>Package Name: <span className="text-primary">com.jkcoin.app</span></li>
              <li>Flutter Engine: 3.29.x (Stable)</li>
              <li>Google Mobile Ads App ID injected into AndroidManifest.xml</li>
              <li>Firebase App Check enabled with SafetyNet / Play Integrity API</li>
              <li>Encrypted SharedPreferences used for offline Hive database encryption</li>
              <li>Obfuscation enabled via R8 & ProGuard rules</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
