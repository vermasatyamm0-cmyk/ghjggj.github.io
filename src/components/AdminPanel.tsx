import React, { useState } from 'react';
import { Question, RedeemRequest, Difficulty, QuestionType } from '../types';
import {
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bot,
  Users,
  Coins,
  Send,
  X,
  HelpCircle
} from 'lucide-react';
import { soundService } from '../services/soundService';

interface AdminPanelProps {
  questions: Question[];
  redeemRequests: RedeemRequest[];
  onAddQuestion: (q: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onUpdateRedeemStatus: (id: string, status: 'approved' | 'rejected') => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  questions,
  redeemRequests,
  onAddQuestion,
  onDeleteQuestion,
  onUpdateRedeemStatus,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'ai_gen' | 'add_manual' | 'manage_q' | 'redeems' | 'assistant'>('ai_gen');

  // AI Question Generator Form state
  const [aiCategory, setAiCategory] = useState('general_knowledge');
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty>('Medium');
  const [aiTopic, setAiTopic] = useState('');
  const [aiCount, setAiCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Partial<Question>[]>([]);

  // Manual Add Form state
  const [manualText, setManualText] = useState('');
  const [manualCategory, setManualCategory] = useState('general_knowledge');
  const [manualDifficulty, setManualDifficulty] = useState<Difficulty>('Medium');
  const [manualType, setManualType] = useState<QuestionType>('MCQ');
  const [manualOptions, setManualOptions] = useState(['', '', '', '']);
  const [manualCorrectIndex, setManualCorrectIndex] = useState(0);
  const [manualExplanation, setManualExplanation] = useState('');
  const [manualHint, setManualHint] = useState('');
  const [manualRewardCoins, setManualRewardCoins] = useState(15);

  // Admin AI Assistant state
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatLogs, setAiChatLogs] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    {
      sender: 'bot',
      text: 'Hello Admin! I am your JK Coin Gemini AI Assistant. Ask me for category ideas, question review, or engagement tips!'
    }
  ]);
  const [isAiChatLoading, setIsAiChatLoading] = useState(false);

  // Handle AI Question Generation
  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playClick();
    setIsGenerating(true);
    setGeneratedQuestions([]);

    try {
      const res = await fetch('/api/gemini/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: aiCategory,
          difficulty: aiDifficulty,
          topic: aiTopic,
          count: aiCount
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        soundService.playFanfare();
        setGeneratedQuestions(data.questions);
      } else {
        alert('Failed to generate questions: ' + (data.error || 'Unknown error'));
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert('Error connecting to AI Question Generator endpoint: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveGenerated = (genQ: Partial<Question>) => {
    soundService.playCorrect();
    const newQ: Question = {
      id: 'q_' + Date.now() + Math.random().toString(36).substring(2, 5),
      category: aiCategory,
      questionText: genQ.questionText || 'Generated Question',
      type: 'MCQ',
      options: genQ.options || ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswerIndex: genQ.correctAnswerIndex ?? 0,
      explanation: genQ.explanation || '',
      difficulty: aiDifficulty,
      rewardCoins: aiDifficulty === 'Easy' ? 10 : aiDifficulty === 'Medium' ? 15 : 25,
      hint: genQ.hint || ''
    };
    onAddQuestion(newQ);
    setGeneratedQuestions((prev) => prev.filter((q) => q !== genQ));
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playCorrect();

    const newQ: Question = {
      id: 'q_' + Date.now(),
      category: manualCategory,
      questionText: manualText,
      type: manualType,
      options: manualOptions,
      correctAnswerIndex: manualCorrectIndex,
      explanation: manualExplanation,
      difficulty: manualDifficulty,
      rewardCoins: manualRewardCoins,
      hint: manualHint
    };

    onAddQuestion(newQ);
    alert('Question added successfully!');

    // Reset form
    setManualText('');
    setManualOptions(['', '', '', '']);
    setManualExplanation('');
    setManualHint('');
  };

  const handleAiChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim() || isAiChatLoading) return;

    soundService.playClick();
    const userMsg = aiChatInput;
    setAiChatInput('');
    setAiChatLogs((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsAiChatLoading(true);

    try {
      const res = await fetch('/api/gemini/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userMsg,
          context: {
            totalQuestions: questions.length,
            pendingRedeems: redeemRequests.filter((r) => r.status === 'pending').length
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiChatLogs((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        setAiChatLogs((prev) => [
          ...prev,
          { sender: 'bot', text: 'Error: ' + (data.error || 'Failed to get AI response') }
        ]);
      }
    } catch {
      setAiChatLogs((prev) => [
        ...prev,
        { sender: 'bot', text: 'Server connection error. Please check backend status.' }
      ]);
    } finally {
      setIsAiChatLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-surface dark:bg-zinc-900 border border-outline-variant/50 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 my-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-outline-variant/30 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-500">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-on-surface dark:text-zinc-100">
                JK Coin Admin Control Panel
              </h2>
              <p className="text-xs text-on-surface-variant dark:text-zinc-400">
                Manage questions, AI generator, user rewards & system health.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 text-outline"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-surface-container-lowest dark:bg-zinc-800/80 p-3 rounded-2xl border border-outline-variant/30 text-center">
            <span className="text-lg font-black text-primary dark:text-blue-400">1,450</span>
            <p className="text-[10px] text-outline font-bold">Total Players</p>
          </div>
          <div className="bg-surface-container-lowest dark:bg-zinc-800/80 p-3 rounded-2xl border border-outline-variant/30 text-center">
            <span className="text-lg font-black text-amber-500">{questions.length}</span>
            <p className="text-[10px] text-outline font-bold">Active Questions</p>
          </div>
          <div className="bg-surface-container-lowest dark:bg-zinc-800/80 p-3 rounded-2xl border border-outline-variant/30 text-center">
            <span className="text-lg font-black text-rose-500">
              {redeemRequests.filter((r) => r.status === 'pending').length}
            </span>
            <p className="text-[10px] text-outline font-bold">Pending Payouts</p>
          </div>
          <div className="bg-surface-container-lowest dark:bg-zinc-800/80 p-3 rounded-2xl border border-outline-variant/30 text-center">
            <span className="text-lg font-black text-emerald-500">145k 🪙</span>
            <p className="text-[10px] text-outline font-bold">Total Coins Issued</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-outline-variant/30 dark:border-zinc-800 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('ai_gen')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'ai_gen'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Question Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('add_manual')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'add_manual'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Manual Question</span>
          </button>

          <button
            onClick={() => setActiveTab('manage_q')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'manage_q'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Questions List ({questions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('redeems')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'redeems'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Approve Payouts ({redeemRequests.filter((r) => r.status === 'pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'assistant'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>AI Admin Assistant</span>
          </button>
        </div>

        {/* Tab 1: AI Question Generator */}
        {activeTab === 'ai_gen' && (
          <div className="space-y-4">
            <form onSubmit={handleGenerateQuestions} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1">
                  Category
                </label>
                <select
                  value={aiCategory}
                  onChange={(e) => setAiCategory(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant/40 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold dark:text-zinc-100"
                >
                  <option value="general_knowledge">General Knowledge</option>
                  <option value="science">Science & Nature</option>
                  <option value="history">History & Culture</option>
                  <option value="geography">Geography</option>
                  <option value="technology">Technology & AI</option>
                  <option value="space">Space & Astronomy</option>
                  <option value="economics">Economics & Finance</option>
                  <option value="india_gk">India GK</option>
                  <option value="current_affairs">Current Affairs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1">
                  Difficulty
                </label>
                <select
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value as Difficulty)}
                  className="w-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant/40 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold dark:text-zinc-100"
                >
                  <option value="Easy">Easy (+10 Coins)</option>
                  <option value="Medium">Medium (+15 Coins)</option>
                  <option value="Hard">Hard (+25 Coins)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1">
                  Specific Sub-Topic (Optional)
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Cryptocurrency, Solar System, ISRO"
                  className="w-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant/40 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs dark:text-zinc-100"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 py-3 rounded-2xl font-bold text-xs shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>
                    {isGenerating ? 'Gemini AI is Generating Questions...' : 'Generate Questions with Gemini AI'}
                  </span>
                </button>
              </div>
            </form>

            {/* Generated Preview List */}
            {generatedQuestions.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-outline-variant/30">
                <h3 className="font-bold text-xs text-on-surface dark:text-zinc-100">
                  Generated Questions ({generatedQuestions.length}) — Click "Approve & Add" to publish
                </h3>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {generatedQuestions.map((gq, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-container-lowest dark:bg-zinc-800/80 border border-amber-500/30 p-4 rounded-2xl space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-on-surface dark:text-zinc-100">{gq.questionText}</p>
                        <button
                          onClick={() => handleApproveGenerated(gq)}
                          className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] hover:bg-emerald-500 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Approve & Add</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-on-surface-variant dark:text-zinc-300">
                        {gq.options?.map((opt, oIdx) => (
                          <span
                            key={oIdx}
                            className={`p-1.5 rounded-lg border ${
                              oIdx === gq.correctAnswerIndex
                                ? 'bg-emerald-500/20 border-emerald-500 font-bold text-emerald-700 dark:text-emerald-300'
                                : 'border-outline-variant/30'
                            }`}
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-amber-600 dark:text-amber-300 font-medium">
                        Explanation: {gq.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Add Manual Question */}
        {activeTab === 'add_manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1">Question Text</label>
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Enter question text..."
                rows={2}
                className="w-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant/40 dark:border-zinc-700 rounded-xl p-3 outline-none dark:text-zinc-100"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Category</label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant/40 dark:border-zinc-700 rounded-xl p-2.5 font-bold dark:text-zinc-100"
                >
                  <option value="general_knowledge">General Knowledge</option>
                  <option value="science">Science & Nature</option>
                  <option value="history">History & Culture</option>
                  <option value="geography">Geography</option>
                  <option value="technology">Technology & AI</option>
                  <option value="space">Space & Astronomy</option>
                  <option value="economics">Economics & Finance</option>
                  <option value="india_gk">India GK</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Difficulty</label>
                <select
                  value={manualDifficulty}
                  onChange={(e) => setManualDifficulty(e.target.value as Difficulty)}
                  className="w-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant/40 dark:border-zinc-700 rounded-xl p-2.5 font-bold dark:text-zinc-100"
                >
                  <option value="Easy">Easy (+10 Coins)</option>
                  <option value="Medium">Medium (+15 Coins)</option>
                  <option value="Hard">Hard (+25 Coins)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Options (4 Choices)</label>
              <div className="grid grid-cols-2 gap-2">
                {manualOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctIndex"
                      checked={manualCorrectIndex === idx}
                      onChange={() => setManualCorrectIndex(idx)}
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const copy = [...manualOptions];
                        copy[idx] = e.target.value;
                        setManualOptions(copy);
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className="w-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant/40 rounded-xl p-2 outline-none dark:text-zinc-100"
                      required
                    />
                  </div>
                ))}
              </div>
              <span className="text-[10px] text-outline mt-1 block">
                Radio button marks the correct answer.
              </span>
            </div>

            <div>
              <label className="block font-bold mb-1">Explanation & Hint</label>
              <input
                type="text"
                value={manualExplanation}
                onChange={(e) => setManualExplanation(e.target.value)}
                placeholder="1-2 sentence educational explanation..."
                className="w-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant/40 rounded-xl p-2.5 mb-2 outline-none dark:text-zinc-100"
                required
              />
              <input
                type="text"
                value={manualHint}
                onChange={(e) => setManualHint(e.target.value)}
                placeholder="Hint string for 50-50 lifeline..."
                className="w-full bg-surface-container-low dark:bg-zinc-800 border border-outline-variant/40 rounded-xl p-2.5 outline-none dark:text-zinc-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-3 rounded-2xl font-bold text-xs shadow-md"
            >
              Save New Question
            </button>
          </form>
        )}

        {/* Tab 3: Manage Questions List */}
        {activeTab === 'manage_q' && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {questions.map((q) => (
              <div
                key={q.id}
                className="bg-surface-container-lowest dark:bg-zinc-800/80 border border-outline-variant/30 p-3 rounded-2xl flex justify-between items-center text-xs"
              >
                <div>
                  <span className="text-[10px] font-bold text-primary dark:text-blue-400 uppercase">
                    [{q.category}] • {q.difficulty}
                  </span>
                  <p className="font-bold text-on-surface dark:text-zinc-100">{q.questionText}</p>
                </div>
                <button
                  onClick={() => onDeleteQuestion(q.id)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Approve Payouts */}
        {activeTab === 'redeems' && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 text-xs">
            {redeemRequests.length === 0 ? (
              <p className="text-center text-outline py-6">No payout requests found.</p>
            ) : (
              redeemRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-surface-container-lowest dark:bg-zinc-800/80 border border-outline-variant/30 p-4 rounded-2xl flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-on-surface dark:text-zinc-100">
                        {req.userName} — ₹{req.amountINR} ({req.type})
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          req.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-600'
                            : req.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-600'
                            : 'bg-amber-500/20 text-amber-600'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-outline mt-0.5">Target: {req.targetDetails}</p>
                  </div>

                  {req.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateRedeemStatus(req.id, 'approved')}
                        className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-500 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => onUpdateRedeemStatus(req.id, 'rejected')}
                        className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-rose-500 flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-outline font-bold">{req.status}</span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 5: AI Admin Assistant Chat */}
        {activeTab === 'assistant' && (
          <div className="space-y-3">
            <div className="bg-surface-container-lowest dark:bg-zinc-800/80 border border-outline-variant/30 rounded-2xl p-4 h-60 overflow-y-auto space-y-3 text-xs">
              {aiChatLogs.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-primary text-on-primary font-medium'
                        : 'bg-surface-container dark:bg-zinc-700 text-on-surface dark:text-zinc-100'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAiChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                placeholder="Ask Gemini AI for advice on quiz questions, user growth..."
                className="flex-1 bg-surface-container-low dark:bg-zinc-800 border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs outline-none dark:text-zinc-100"
              />
              <button
                type="submit"
                disabled={isAiChatLoading}
                className="bg-primary text-on-primary px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
