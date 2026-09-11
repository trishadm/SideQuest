import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import XPBar from '../components/XPBar';
import MatchCard from '../components/MatchCard';
import SwapRequestModal from '../components/SwapRequestModal';
import {
  Sparkles,
  ArrowLeftRight,
  MessageSquare,
  BookOpen,
  Star,
  Award,
  Plus,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [topMatches, setTopMatches] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [pendingSwapsCount, setPendingSwapsCount] = useState(0);

  const [selectedMatchForSwap, setSelectedMatchForSwap] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // 1. Top Recommended Matches
        const matchesRes = await API.get('/matches?minScore=75');
        setTopMatches(matchesRes.data.slice(0, 3));

        // 2. Active Sessions
        const sessionRes = await API.get('/sessions');
        setActiveSessions(sessionRes.data.filter(s => s.status === 'In Progress'));

        // 3. Pending Swaps
        const swapsRes = await API.get('/swaps');
        const pending = swapsRes.data.filter(s => s.status === 'Pending' && s.receiver?._id === user._id);
        setPendingSwapsCount(pending.length);

      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    };

    fetchDashboardData();
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 glass-panel border border-[#7CA1D9] bg-white dark:bg-[#181B29] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#7CA1D9]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Welcome Row */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#DFC3E3] dark:border-[#2D3148] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#7CA1D9]"
              />
              <div>
                <h1 className="heading-font text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Welcome back, {user.name}! <Sparkles className="w-5 h-5 text-[#7CA1D9]" />
                </h1>
                <p className="text-xs text-slate-600 dark:text-[#D7C8E9] mt-1">
                  Ready to teach <strong className="text-[#7CA1D9]">{user.teachingSkills?.[0]?.name || 'your skills'}</strong> and learn something new today?
                </p>
              </div>
            </div>
          </div>

          {/* Action Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/discover"
              className="px-5 py-3 rounded-2xl bg-[#7CA1D9] hover:bg-[#6B90CB] text-white font-extrabold text-xs shadow-sm flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-white" /> Find Skill Matches
            </Link>
            <Link
              to={`/profile/${user.username}`}
              className="px-5 py-3 rounded-2xl glass-panel border border-[#DFC3E3] dark:border-[#2D3148] hover:border-[#7CA1D9] text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              + Add / Edit Skills
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#DFC3E3] dark:border-[#2D3148]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7CA1D9]/20 border border-[#7CA1D9]/30 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-[#7CA1D9]" />
            </div>
            <div>
              <span className="block text-lg font-black text-slate-900 dark:text-white">{user.completedSwapsCount || 0}</span>
              <span className="text-[11px] text-slate-600 dark:text-[#D7C8E9] font-medium">Completed Swaps</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#BEC3EA]/30 border border-[#BEC3EA]/50 flex items-center justify-center">
              <Star className="w-5 h-5 text-slate-800 dark:text-[#BEC3EA] fill-current" />
            </div>
            <div>
              <span className="block text-lg font-black text-slate-900 dark:text-white">{(user.ratings?.overall || 5.0).toFixed(1)}★</span>
              <span className="text-[11px] text-slate-600 dark:text-[#D7C8E9] font-medium">Peer Rating</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D7C8E9]/30 border border-[#D7C8E9]/50 flex items-center justify-center">
              <Award className="w-5 h-5 text-slate-800 dark:text-[#D7C8E9]" />
            </div>
            <div>
              <span className="block text-lg font-black text-slate-900 dark:text-white">Lvl {user.level || 1}</span>
              <span className="text-[11px] text-slate-600 dark:text-[#D7C8E9] font-medium">{user.xp || 0} Total XP</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E7B5D3]/30 border border-[#E7B5D3]/50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-slate-800 dark:text-[#E7B5D3]" />
            </div>
            <div>
              <span className="block text-lg font-black text-slate-900 dark:text-white">{activeSessions.length} Active</span>
              <span className="text-[11px] text-slate-600 dark:text-[#D7C8E9] font-medium">Learning Plans</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Left 2 Cols = Matches & Sessions, Right 1 Col = XP Bar & Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Active Learning Plans Preview */}
          {activeSessions.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 border border-[#DFC3E3] dark:border-[#2D3148]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#7CA1D9]" /> Active Session Learning Tracker
                </h3>
                <Link to="/sessions" className="text-xs font-bold text-[#7CA1D9] hover:underline flex items-center gap-1">
                  View Tracker →
                </Link>
              </div>

              <div className="space-y-4">
                {activeSessions.map((plan) => {
                  const partner = plan.userA?._id === user._id ? plan.userB : plan.userA;
                  const progress = Math.round((plan.completedSessionsCount / plan.totalSessions) * 100);
                  return (
                    <div key={plan._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141724] border border-[#DFC3E3] dark:border-[#2D3148] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={partner?.avatar} className="w-10 h-10 rounded-xl object-cover border border-[#7CA1D9]" alt="" />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            Swapping {plan.skillA} ➔ {plan.skillB}
                          </h4>
                          <span className="text-xs text-slate-600 dark:text-[#D7C8E9]">With {partner?.name}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#7CA1D9]">{plan.completedSessionsCount}/{plan.totalSessions} Sessions Done ({progress}%)</span>
                        <div className="w-32 bg-slate-200 dark:bg-[#181B29] rounded-full h-2 mt-1 border border-[#DFC3E3] dark:border-[#2D3148] overflow-hidden">
                          <div className="bg-[#7CA1D9] h-full rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top Recommended Matches Feed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#7CA1D9]" /> Top Smart Matches For You
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#D7C8E9]">Calculated by skill compatibility, level & schedule match.</p>
              </div>
              <Link to="/discover" className="text-xs font-bold text-[#7CA1D9] hover:underline flex items-center gap-1">
                Explore All Matches →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topMatches.length > 0 ? (
                topMatches.map((match) => (
                  <MatchCard
                    key={match.user._id}
                    match={match}
                    onOpenSwapModal={(m) => setSelectedMatchForSwap(m)}
                  />
                ))
              ) : (
                <div className="col-span-2 glass-panel p-8 rounded-3xl text-center border border-[#DFC3E3] dark:border-[#2D3148]">
                  <Sparkles className="w-10 h-10 text-[#7CA1D9] mx-auto mb-3 opacity-60" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Finding Compatibility Matches...</h4>
                  <p className="text-xs text-slate-600 dark:text-[#D7C8E9] mt-1 max-w-sm mx-auto">
                    Add skills you teach and skills you want to learn on your profile to generate instant high-compatibility matches!
                  </p>
                  <Link to={`/profile/${user.username}`} className="inline-block mt-4 text-xs font-bold text-[#7CA1D9] hover:underline">
                    Edit Your Skills →
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Sidebar (1 Col) */}
        <div className="space-y-6">

          {/* XP & Level Widget */}
          <XPBar user={user} />

          {/* Pending Swap Requests Alert Box */}
          {pendingSwapsCount > 0 && (
            <div className="p-5 rounded-2xl bg-[#BEC3EA]/20 border border-[#DFC3E3] dark:border-[#2D3148] text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                <ArrowLeftRight className="w-4 h-4 text-[#7CA1D9]" />
                <span>You have {pendingSwapsCount} Pending Swap Requests!</span>
              </div>
              <p className="text-slate-600 dark:text-[#D7C8E9] mb-3">Review incoming offers to start private chat and learning plans.</p>
              <Link
                to="/swaps"
                className="w-full py-2 px-4 rounded-xl bg-[#7CA1D9] hover:bg-[#6B90CB] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors"
              >
                Review Requests Now →
              </Link>
            </div>
          )}

          {/* Quick Chat Shortcut */}
          <div className="glass-panel p-5 rounded-2xl border border-[#DFC3E3] dark:border-[#2D3148]">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#7CA1D9]" /> Direct Messages
            </h4>
            <p className="text-xs text-slate-600 dark:text-[#D7C8E9] mb-4">Chat in real-time with accepted skill exchange partners.</p>
            <Link
              to="/chat"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-[#141724] border border-[#DFC3E3] dark:border-[#2D3148] hover:border-[#7CA1D9] text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              Open Messaging Console
            </Link>
          </div>

        </div>

      </div>

      {/* Swap Request Modal */}
      {selectedMatchForSwap && (
        <SwapRequestModal
          match={selectedMatchForSwap}
          onClose={() => setSelectedMatchForSwap(null)}
          onSuccess={() => {
            setSelectedMatchForSwap(null);
            showToast('Skill Swap Request Sent Successfully!');
          }}
        />
      )}

    </div>
  );
}
