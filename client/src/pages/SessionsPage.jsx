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
        <div className="fixed top-20 right-6 z-50 glass-panel border border-[#7CA1D9] bg-white dark:bg-[#181B29] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#7CA1D9]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        <h1 className="heading-font text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-[#7CA1D9]" /> Session Tracker & Learning Plans
        </h1>
        <p className="text-xs text-slate-600 dark:text-[#D7C8E9] mt-1">
          Track session progress, check off topics, share notes, and earn XP upon completion.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-slate-500 dark:text-[#D7C8E9]">Loading session tracker...</div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left List of Plans */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#D7C8E9]">Active Skill Exchange Plans</h3>
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
                      ? 'bg-[#7CA1D9]/20 border-[#7CA1D9]'
                      : 'glass-panel border-[#DFC3E3] dark:border-[#2D3148] hover:border-[#7CA1D9]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={partner?.avatar} className="w-10 h-10 rounded-xl object-cover border border-[#7CA1D9]" alt="" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{partner?.name}</h4>
                      <span className="text-[11px] text-[#7CA1D9] font-bold">
                        {plan.skillA} ⇄ {plan.skillB}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#DFC3E3] dark:border-[#2D3148] flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-[#D7C8E9]">{plan.completedSessionsCount}/{plan.totalSessions} Done</span>
                    <span className="font-bold text-[#7CA1D9]">{progress}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Active Plan Workspace */}
          {activePlan && (
            <div className="lg:col-span-2 space-y-6">

              {/* Plan Header Card */}
              <div className="glass-panel p-6 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148]">
                {(() => {
                  const partner = activePlan.userA?._id === user._id ? activePlan.userB : activePlan.userA;
                  const progress = Math.round((activePlan.completedSessionsCount / activePlan.totalSessions) * 100);

                  return (
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <img src={partner?.avatar} className="w-12 h-12 rounded-2xl object-cover border border-[#7CA1D9]" alt="" />
                          <div>
                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                              {activePlan.skillA} ⇄ {activePlan.skillB}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-[#D7C8E9]">Partner: <strong className="text-[#7CA1D9]">{partner?.name}</strong></p>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${activePlan.status === 'Completed'
                            ? 'bg-[#7CA1D9]/20 text-slate-800 dark:text-[#BEC3EA] border border-[#7CA1D9]/40'
                            : 'bg-[#BEC3EA]/30 text-slate-800 dark:text-[#BEC3EA] border border-[#BEC3EA]/50'
                          }`}>
                          {activePlan.status}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-[#D7C8E9]">
                          <span>Overall Learning Progress</span>
                          <span className="text-[#7CA1D9]">{progress}% Complete</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-[#141724] rounded-full h-3 p-0.5 border border-[#DFC3E3] dark:border-[#2D3148] overflow-hidden">
                          <div
                            className="bg-[#7CA1D9] h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Session Milestones Checklist */}
              <div className="glass-panel p-6 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148]">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#7CA1D9]" /> Planned Session Milestones
                </h4>

                <div className="space-y-3">
                  {activePlan.sessions.map((item) => (
                    <div
                      key={item.sessionNumber}
                      onClick={() => handleToggleSession(item.sessionNumber)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${item.isCompleted
                          ? 'bg-[#7CA1D9]/15 border-[#7CA1D9]/40 text-slate-900 dark:text-white'
                          : 'bg-slate-50 dark:bg-[#141724] border-[#DFC3E3] dark:border-[#2D3148] text-slate-800 dark:text-slate-200 hover:border-[#7CA1D9]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.isCompleted ? (
                          <CheckSquare className="w-5 h-5 text-[#7CA1D9] flex-shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-xs text-slate-900 dark:text-white block">
                            Session {item.sessionNumber}: {item.title}
                          </span>
                          {item.notes && <p className="text-[11px] text-slate-500 dark:text-[#D7C8E9] mt-0.5">{item.notes}</p>}
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${item.isCompleted ? 'bg-[#7CA1D9]/20 text-[#7CA1D9]' : 'bg-slate-200 dark:bg-[#181B29] text-slate-600 dark:text-slate-400'
                        }`}>
                        {item.isCompleted ? 'Completed (+50 XP)' : 'Mark Done'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaborative Notes */}
              <div className="glass-panel p-6 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Save className="w-4 h-4 text-[#7CA1D9]" /> Collaborative Session Notes & Resources
                  </h4>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1.5 rounded-xl bg-[#7CA1D9] hover:bg-[#6B90CB] text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Notes
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={sharedNotes}
                  onChange={(e) => setSharedNotes(e.target.value)}
                  placeholder="Keep track of homework, useful links, code snippets, and practice schedules here..."
                  className="w-full glass-input rounded-xl p-3 text-xs text-slate-900 dark:text-white bg-white dark:bg-[#141724]"
                />
              </div>

            </div>
          )}

        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center border border-[#DFC3E3] dark:border-[#2D3148] max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-[#7CA1D9] mx-auto mb-3 opacity-60" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No Active Session Trackers Yet</h3>
          <p className="text-xs text-slate-600 dark:text-[#D7C8E9] mt-1">Accept a skill swap request to automatically generate a shared learning plan!</p>
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
