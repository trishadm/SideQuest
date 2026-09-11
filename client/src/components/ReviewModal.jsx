import React, { useState } from 'react';
import { X, Star, Award, Send } from 'lucide-react';
import API from '../services/api';

export default function ReviewModal({ swapPlan, reviewee, onClose, onSuccess }) {
  const [teachingQuality, setTeachingQuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [knowledge, setKnowledge] = useState(5);
  const [friendliness, setFriendliness] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [overall, setOverall] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const renderStarInput = (label, value, setter) => (
    <div className="flex items-center justify-between py-1.5 border-b border-[#DFC3E3]/60 dark:border-[#2D3148] text-xs">
      <span className="font-semibold text-slate-700 dark:text-[#D7C8E9]">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setter(star)}
            className="p-1 transition-transform hover:scale-125"
          >
            <Star className={`w-4 h-4 ${star <= value ? 'text-[#7CA1D9] fill-[#7CA1D9]' : 'text-slate-400 dark:text-slate-600'}`} />
          </button>
        ))}
        <span className="ml-1 text-[11px] font-bold text-[#7CA1D9] w-4">{value}★</span>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return setError('Please write a short review comment');
    setLoading(true);
    setError('');

    try {
      await API.post('/reviews', {
        swapRequestId: swapPlan.swapRequest,
        revieweeId: reviewee._id,
        teachingQuality,
        communication,
        knowledge,
        friendliness,
        punctuality,
        overall,
        comment
      });

      setLoading(false);
      onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error submitting review');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel rounded-3xl max-w-lg w-full p-6 border border-[#DFC3E3] dark:border-[#2D3148] shadow-2xl relative bg-white dark:bg-[#181B29]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-500 dark:text-[#D7C8E9] hover:text-slate-900 dark:hover:text-white p-1 rounded-xl bg-slate-100 dark:bg-[#141724] border border-[#DFC3E3] dark:border-[#2D3148]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#7CA1D9]/20 border border-[#7CA1D9]/40 flex items-center justify-center">
            <Award className="w-6 h-6 text-[#7CA1D9]" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Rate & Review Swap Partner</h3>
            <p className="text-xs text-slate-600 dark:text-[#D7C8E9]">Feedback for <strong className="text-[#7CA1D9]">{reviewee?.name}</strong></p>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-3 rounded-xl bg-[#E7B5D3]/20 border border-[#E7B5D3] text-xs text-slate-900 dark:text-[#E7B5D3]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {renderStarInput('Overall Rating', overall, setOverall)}
          {renderStarInput('Teaching Quality', teachingQuality, setTeachingQuality)}
          {renderStarInput('Communication & Clarity', communication, setCommunication)}
          {renderStarInput('Knowledge & Expertise', knowledge, setKnowledge)}
          {renderStarInput('Friendliness & Patience', friendliness, setFriendliness)}
          {renderStarInput('Punctuality & Schedule', punctuality, setPunctuality)}

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1">
              Written Review Comment:
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about what you learned and what made this skill swap great!"
              className="w-full glass-input rounded-xl p-3 text-xs"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#DFC3E3] dark:border-[#2D3148] text-xs font-bold text-slate-700 dark:text-[#D7C8E9] hover:bg-slate-100 dark:hover:bg-[#212538]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#7CA1D9] hover:bg-[#6B90CB] text-xs font-extrabold text-white shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? 'Submitting...' : (
                <>
                  <Send className="w-4 h-4" /> Submit Review (+150 XP)
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
