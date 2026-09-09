import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, ArrowLeftRight } from 'lucide-react';

export default function MatchCard({ match, onOpenSwapModal }) {
  const { user: candidate, compatibilityScore } = match;

  const scoreColorClass = compatibilityScore >= 85
    ? 'from-pink-500 via-purple-500 to-sky-400 text-white shadow-md'
    : compatibilityScore >= 70
      ? 'from-purple-500 to-indigo-500 text-white shadow-md'
      : 'from-slate-400 to-slate-500 text-white';

  const teachSkills = candidate.teachingSkills && candidate.teachingSkills.length > 0
    ? candidate.teachingSkills.map(s => s.name || s).filter(Boolean)
    : [];

  const learnSkills = candidate.learningSkills && candidate.learningSkills.length > 0
    ? candidate.learningSkills.map(s => s.name || s).filter(Boolean)
    : [];

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-5 border border-pink-200/80 dark:border-pink-900/30 flex flex-col justify-between relative overflow-hidden gap-4">
      
      {/* Primary Identity & Match Score Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <Link to={`/profile/${candidate.username}`} className="relative group shrink-0">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-purple-200 dark:border-purple-800 group-hover:border-pink-400 transition-colors shadow-sm"
            />
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${candidate.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`} />
          </Link>

          <div className="min-w-0">
            <Link to={`/profile/${candidate.username}`} className="font-extrabold text-base text-pink-950 dark:text-white hover:text-pink-600 transition-colors truncate block">
              {candidate.name}
            </Link>
            <div className="flex items-center gap-2 text-xs text-purple-800 dark:text-slate-400 mt-0.5 font-medium truncate">
              <span className="text-pink-600 dark:text-pink-400 font-bold shrink-0">@{candidate.username}</span>
              <span>•</span>
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-pink-500 shrink-0" /> {candidate.location || 'Remote'}
              </span>
            </div>
          </div>
        </div>

        {/* Compatibility Score Badge */}
        <div className={`px-3 py-1.5 rounded-2xl text-xs font-black tracking-wide bg-gradient-to-r ${scoreColorClass} flex items-center gap-1.5 border border-white/40 shrink-0`}>
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>{compatibilityScore}% Match</span>
        </div>
      </div>

      {/* Compact Skill Summary Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-pink-200/60 dark:border-pink-900/30">
        
        {/* CAN TEACH */}
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-pink-600 dark:text-pink-400 block mb-1.5">
            Can Teach
          </span>
          {teachSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {teachSkills.slice(0, 3).map((skillName, idx) => (
                <span key={idx} className="text-[11px] font-bold text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/50 px-2 py-0.5 rounded-lg border border-pink-200/80 dark:border-pink-900/40 leading-snug">
                  {skillName}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-purple-700 dark:text-slate-400 italic">No skills listed</span>
          )}
        </div>

        {/* WANTS TO LEARN */}
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-purple-700 dark:text-purple-400 block mb-1.5">
            Wants To Learn
          </span>
          {learnSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {learnSkills.slice(0, 3).map((skillName, idx) => (
                <span key={idx} className="text-[11px] font-bold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-lg border border-purple-200/80 dark:border-purple-900/40 leading-snug">
                  {skillName}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-purple-700 dark:text-slate-400 italic">No goals listed</span>
          )}
        </div>

      </div>

      {/* Minimal Action Button */}
      <button
        onClick={() => onOpenSwapModal(match)}
        className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-pink-500 via-purple-500 to-sky-400 hover:from-pink-600 hover:to-sky-500 shadow-md flex items-center justify-center gap-2 transition-all duration-200"
      >
        <ArrowLeftRight className="w-4 h-4" /> Send Skill Swap Request
      </button>

    </div>
  );
}
