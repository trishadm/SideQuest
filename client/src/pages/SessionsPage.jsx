import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import ReviewModal from '../components/ReviewModal';
import {
  BookOpen,
  CheckSquare,
  Square,
  Award,
  Star,
  Clock,
  Save,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function SessionsPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activePlan, setActivePlan] = useState(null);
  const [sharedNotes, setSharedNotes] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/sessions');
      setPlans(data);
      if (data.length > 0 && !activePlan) {
        setActivePlan(data[0]);
        setSharedNotes(data[0].sharedNotes || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleToggleSession = async (sessionNumber) => {
    if (!activePlan) return;
    try {
      const { data } = await API.put(`/sessions/${activePlan._id}/toggle-session`, {
        sessionNumber
      });

      setActivePlan(data);
      setPlans(plans.map(p => p._id === data._id ? data : p));

      if (data.status === 'Completed') {
        showToast('🎉 Swap Completed! 200 XP Awarded to both users!');
        setShowReviewModal(true);
      } else {
        showToast('Session Milestone Checked (+50 XP)!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    if (!activePlan) return;
    try {
      await API.put(`/sessions/${activePlan._id}/notes`, { sharedNotes });
      showToast('Shared notes saved!');
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 glass-panel border border-emerald-500/40 bg-emerald-950/80 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold text-emerald-200 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        <h1 className="heading-font text-3xl font-black text-white flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-emerald-400" /> Session Tracker & Learning Plans
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Track session progress, check off topics, share notes, and earn XP upon completion.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-slate-400">Loading session tracker...</div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left List of Plans */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Skill Exchange Plans</h3>
            {plans.map((plan) => {
              const partner = plan.userA?._id === user._id ? plan.userB : plan.userA;
              const isSelected = activePlan?._id === plan._id;
              const progress = Math.round((plan.completedSessionsCount / plan.totalSessions) * 100);

              return (
                <button
                  key={plan._id}
                  onClick={() => {
                    setActivePlan(plan);
                    setSharedNotes(plan.sharedNotes || '');
                  }}
                  className={`w-full p-4 rounded-2xl text-left border transition-all ${isSelected
                      ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/30 border-indigo-500/50 shadow-glow'
                      : 'glass-panel border-slate-800 hover:border-slate-700'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={partner?.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                    <div>
                      <h4 className="font-extrabold text-xs text-white">{partner?.name}</h4>
                      <span className="text-[11px] text-indigo-300">
                        {plan.skillA} ⇄ {plan.skillB}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{plan.completedSessionsCount}/{plan.totalSessions} Done</span>
                    <span className="font-bold text-emerald-400">{progress}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Active Plan Workspace */}
          {activePlan && (
            <div className="lg:col-span-2 space-y-6">

              {/* Plan Header Card */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800">
                {(() => {
                  const partner = activePlan.userA?._id === user._id ? activePlan.userB : activePlan.userA;
                  const progress = Math.round((activePlan.completedSessionsCount / activePlan.totalSessions) * 100);

                  return (
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <img src={partner?.avatar} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                          <div>
                            <h3 className="font-extrabold text-base text-white">
                              {activePlan.skillA} ⇄ {activePlan.skillB}
                            </h3>
                            <p className="text-xs text-slate-400">Partner: <strong className="text-indigo-300">{partner?.name}</strong></p>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${activePlan.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-indigo-950 text-indigo-400 border border-indigo-500/30'
                          }`}>
                          {activePlan.status}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-300">
                          <span>Overall Learning Progress</span>
                          <span className="text-emerald-400">{progress}% Complete</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-glow-emerald"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Session Milestones Checklist */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800">
                <h4 className="font-extrabold text-sm text-white mb-4 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-400" /> Planned Session Milestones
                </h4>

                <div className="space-y-3">
                  {activePlan.sessions.map((item) => (
                    <div
                      key={item.sessionNumber}
                      onClick={() => handleToggleSession(item.sessionNumber)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${item.isCompleted
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.isCompleted ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600 flex-shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-xs text-white block">
                            Session {item.sessionNumber}: {item.title}
                          </span>
                          {item.notes && <p className="text-[11px] text-slate-400 mt-0.5">{item.notes}</p>}
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${item.isCompleted ? 'bg-emerald-900/40 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                        {item.isCompleted ? 'Completed (+50 XP)' : 'Mark Done'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaborative Notes */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Save className="w-4 h-4 text-indigo-400" /> Collaborative Session Notes & Resources
                  </h4>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Notes
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={sharedNotes}
                  onChange={(e) => setSharedNotes(e.target.value)}
                  placeholder="Keep track of homework, useful links, code snippets, and practice schedules here..."
                  className="w-full glass-input rounded-xl p-3 text-xs text-white"
                />
              </div>

            </div>
          )}

        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-60" />
          <h3 className="font-extrabold text-base text-white">No Active Session Trackers Yet</h3>
          <p className="text-xs text-slate-400 mt-1">Accept a skill swap request to automatically generate a shared learning plan!</p>
        </div>
      )}

      {/* Review Modal Triggered when Plan Completed */}
      {showReviewModal && activePlan && (
        <ReviewModal
          swapPlan={activePlan}
          reviewee={activePlan.userA?._id === user._id ? activePlan.userB : activePlan.userA}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            setShowReviewModal(false);
            showToast('Review Submitted Successfully!');
          }}
        />
      )}

    </div>
  );
}
