import React, { useState } from 'react';
import { X, ArrowLeftRight, Send, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function SwapRequestModal({ match, onClose, onSuccess }) {
  const { user } = useAuth();
  const candidate = match?.user;

  const [offeredSkill, setOfferedSkill] = useState(user?.teachingSkills?.[0]?.name || 'Python');
  const [requestedSkill, setRequestedSkill] = useState(candidate?.teachingSkills?.[0]?.name || 'Guitar');
  const [message, setMessage] = useState(`Hi ${candidate?.name || 'there'}! I'd love to swap my ${offeredSkill} skills for your ${requestedSkill} sessions.`);
  const [availability, setAvailability] = useState('Weekends & Evenings');
  const [preferredDuration, setPreferredDuration] = useState('4 sessions (1 month)');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/swaps', {
        receiverId: candidate._id,
        offeredSkill,
        requestedSkill,
        message,
        availability,
        preferredDuration,
        compatibilityScore: match.compatibilityScore
      });

      setLoading(false);
      onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to send swap request');
    }
  };

  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="glass-panel rounded-3xl max-w-lg w-full p-6 border border-[#DFC3E3] dark:border-[#2D3148] shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto bg-white dark:bg-[#181B29]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-500 dark:text-[#D7C8E9] hover:text-slate-900 dark:hover:text-white p-1.5 rounded-xl bg-slate-100 dark:bg-[#141724] border border-[#DFC3E3] dark:border-[#2D3148] z-10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-[#7CA1D9]/20 border border-[#7CA1D9]/40 flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-6 h-6 text-[#7CA1D9]" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Send Skill Swap Request</h3>
            <p className="text-xs text-slate-600 dark:text-[#D7C8E9]">Trading skills with <strong className="text-[#7CA1D9]">{candidate.name}</strong></p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#E7B5D3]/20 border border-[#E7B5D3] text-xs text-slate-900 dark:text-[#E7B5D3]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Skill to Teach */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1.5">
              Skill You Will Teach:
            </label>
            <select
              value={offeredSkill}
              onChange={(e) => setOfferedSkill(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white bg-white dark:bg-[#141724] border border-[#DFC3E3] dark:border-[#2D3148]"
            >
              {user?.teachingSkills && user.teachingSkills.length > 0 ? (
                user.teachingSkills.map((s, idx) => (
                  <option key={idx} value={s.name} className="bg-white dark:bg-[#141724] text-slate-900 dark:text-white">
                    {s.name} (Lvl {s.level})
                  </option>
                ))
              ) : (
                <option value="General Tech Mentorship" className="bg-white dark:bg-[#141724] text-slate-900 dark:text-white">
                  General Tech Mentorship
                </option>
              )}
            </select>
          </div>

          {/* Skill to Learn */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1.5">
              Skill You Want To Learn from {candidate.name}:
            </label>
            <select
              value={requestedSkill}
              onChange={(e) => setRequestedSkill(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white bg-white dark:bg-[#141724] border border-[#DFC3E3] dark:border-[#2D3148]"
            >
              {candidate.teachingSkills && candidate.teachingSkills.length > 0 ? (
                candidate.teachingSkills.map((s, idx) => (
                  <option key={idx} value={s.name} className="bg-white dark:bg-[#141724] text-slate-900 dark:text-white">
                    {s.name} (Lvl {s.level})
                  </option>
                ))
              ) : (
                <option value="General Mentorship" className="bg-white dark:bg-[#141724] text-slate-900 dark:text-white">
                  General Mentorship
                </option>
              )}
            </select>
          </div>

          {/* Availability & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#7CA1D9]" /> Availability:
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Weekends, Evenings"
                className="w-full glass-input rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#7CA1D9]" /> Duration:
              </label>
              <input
                type="text"
                value={preferredDuration}
                onChange={(e) => setPreferredDuration(e.target.value)}
                placeholder="e.g. 4 sessions (1 month)"
                className="w-full glass-input rounded-xl px-3.5 py-2 text-xs"
              />
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1.5">
              Introduction & Swap Proposal Note:
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full glass-input rounded-xl p-3 text-xs"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#DFC3E3] dark:border-[#2D3148] text-xs font-bold text-slate-700 dark:text-[#D7C8E9] hover:bg-slate-100 dark:hover:bg-[#212538] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#7CA1D9] hover:bg-[#6B90CB] text-xs font-extrabold text-white shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? 'Sending...' : (
                <>
                  <Send className="w-4 h-4" /> Send Request
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
