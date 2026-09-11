import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, ArrowLeftRight } from 'lucide-react';

export default function MatchCard({ match, onOpenSwapModal }) {
  const { user: candidate, compatibilityScore } = match;

  const teachSkills = candidate.teachingSkills && candidate.teachingSkills.length > 0
    ? candidate.teachingSkills.map(s => s.name || s).filter(Boolean)
    : [];

  const learnSkills = candidate.learningSkills && candidate.learningSkills.length > 0
    ? candidate.learningSkills.map(s => s.name || s).filter(Boolean)
    : [];

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-5 border border-[#DFC3E3] dark:border-[#2D3148] flex flex-col justify-between relative overflow-hidden gap-4">
      
      {/* Primary Identity & Match Score Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <Link to={`/profile/${candidate.username}`} className="relative group shrink-0">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-[#DFC3E3] dark:border-[#2D3148] group-hover:border-[#7CA1D9] transition-colors shadow-sm"
            />
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0F111A] ${candidate.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`} />
          </Link>

          <div className="min-w-0">
            <Link to={`/profile/${candidate.username}`} className="font-extrabold text-base text-slate-900 dark:text-white hover:text-[#7CA1D9] transition-colors truncate block">
              {candidate.name}
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#D7C8E9] mt-0.5 font-medium truncate">
              <span className="text-[#7CA1D9] font-bold shrink-0">@{candidate.username}</span>
              <span>•</span>
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-[#7CA1D9] shrink-0" /> {candidate.location || 'Remote'}
              </span>
            </div>
          </div>
        </div>

        {/* Compatibility Score Badge */}
        <div className="px-3 py-1.5 rounded-2xl text-xs font-black tracking-wide bg-[#7CA1D9] text-white flex items-center gap-1.5 border border-white/20 shrink-0 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{compatibilityScore}% Match</span>
        </div>
      </div>

      {/* Compact Skill Summary Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#DFC3E3] dark:border-[#2D3148]">
        
        {/* CAN TEACH */}
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#7CA1D9] block mb-1.5">
            Can Teach
          </span>
          {teachSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {teachSkills.slice(0, 3).map((skillName, idx) => (
                <span key={idx} className="text-[11px] font-bold text-slate-800 dark:text-[#BEC3EA] bg-[#BEC3EA]/30 dark:bg-[#BEC3EA]/20 px-2 py-0.5 rounded-lg border border-[#BEC3EA]/50 leading-snug">
                  {skillName}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">No skills listed</span>
          )}
        </div>

        {/* WANTS TO LEARN */}
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#E7B5D3] block mb-1.5">
            Wants To Learn
          </span>
          {learnSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {learnSkills.slice(0, 3).map((skillName, idx) => (
                <span key={idx} className="text-[11px] font-bold text-slate-800 dark:text-[#E7B5D3] bg-[#E7B5D3]/30 dark:bg-[#E7B5D3]/20 px-2 py-0.5 rounded-lg border border-[#E7B5D3]/50 leading-snug">
                  {skillName}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">No goals listed</span>
          )}
        </div>

      </div>

      {/* Minimal Action Button */}
      <button
        onClick={() => onOpenSwapModal(match)}
        className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#7CA1D9] hover:bg-[#6B90CB] shadow-sm flex items-center justify-center gap-2 transition-all duration-200"
      >
        <ArrowLeftRight className="w-4 h-4" /> Send Skill Swap Request
      </button>

    </div>
  );
}
