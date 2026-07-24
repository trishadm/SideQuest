import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Star, ChevronDown, ChevronUp, ArrowLeftRight, CheckCircle2, Globe, Calendar } from 'lucide-react';
import SkillBadge from './SkillBadge';

export default function MatchCard({ match, onOpenSwapModal }) {
  const [showRationale, setShowRationale] = useState(false);
  const { user: candidate, compatibilityScore, rationales } = match;

  const scoreColorClass = compatibilityScore >= 85
    ? 'from-pink-500 via-purple-500 to-sky-400 text-white shadow-md'
    : compatibilityScore >= 70
      ? 'from-purple-500 to-indigo-500 text-white shadow-md'
      : 'from-slate-400 to-slate-500 text-white';

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-5 sm:p-6 border border-pink-200/80 dark:border-pink-900/30 flex flex-col justify-between relative overflow-hidden">

      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link to={`/profile/${candidate.username}`} className="relative group">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-200 dark:border-purple-800 group-hover:border-pink-400 transition-colors shadow-sm"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${candidate.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                }`} />
            </Link>

            <div>
              <Link to={`/profile/${candidate.username}`} className="font-extrabold text-base text-pink-950 dark:text-white hover:text-pink-600 transition-colors block">
                {candidate.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-purple-800 dark:text-slate-400 mt-0.5 font-medium">
                <span className="text-pink-600 dark:text-pink-400 font-bold">@{candidate.username}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-pink-500" /> {candidate.location || 'Remote'}
                </span>
              </div>
            </div>
          </div>

          {/* Compatibility Score Badge */}
          <div className={`px-3.5 py-1.5 rounded-2xl text-xs font-black tracking-wide bg-gradient-to-r ${scoreColorClass} flex items-center gap-1.5 border border-white/40`}>
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{compatibilityScore}% Match</span>
          </div>
        </div>

        {/* Rating & Spoken Languages */}
        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-purple-900 dark:text-slate-200 bg-pink-50/80 dark:bg-purple-950/40 p-2.5 rounded-2xl border border-pink-200/80 dark:border-pink-900/40 font-medium">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{(candidate.ratings?.overall || 5.0).toFixed(1)}</span>
            <span className="text-[11px] text-purple-700 dark:text-slate-400 font-normal">({candidate.ratings?.totalReviews || 0} reviews)</span>
          </div>
          <span className="text-pink-300 dark:text-pink-800">•</span>
          <div className="flex items-center gap-1 text-purple-900 dark:text-slate-300">
            <Globe className="w-3.5 h-3.5 text-purple-500" />
            <span>{(candidate.languages || ['English']).join(', ')}</span>
          </div>
          <span className="text-pink-300 dark:text-pink-800">•</span>
          <div className="flex items-center gap-1 text-purple-900 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-purple-500" />
            <span>{(candidate.availability || ['Flexible']).join(', ')}</span>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-pink-600 dark:text-pink-400 block mb-1.5">
              Can Teach You
            </span>
            <div className="space-y-2">
              {candidate.teachingSkills && candidate.teachingSkills.length > 0 ? (
                candidate.teachingSkills.slice(0, 2).map((s, idx) => (
                  <SkillBadge key={idx} skill={s} type="teach" />
                ))
              ) : (
                <span className="text-xs text-purple-700 italic">No teaching skills listed</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-purple-700 dark:text-purple-400 block mb-1.5">
              Wants To Learn
            </span>
            <div className="space-y-2">
              {candidate.learningSkills && candidate.learningSkills.length > 0 ? (
                candidate.learningSkills.slice(0, 2).map((s, idx) => (
                  <SkillBadge key={idx} skill={s} type="learn" />
                ))
              ) : (
                <span className="text-xs text-purple-700 italic">No learning goals listed</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rationale Accordion Toggle */}
      <div className="mt-4 pt-3 border-t border-pink-200/60 dark:border-pink-900/30">
        <button
          onClick={() => setShowRationale(!showRationale)}
          className="w-full flex items-center justify-between text-xs font-bold text-purple-800 dark:text-purple-300 hover:text-pink-600 transition-colors py-1"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-sky-500" /> Why this match score?
          </span>
          {showRationale ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRationale && (
          <div className="mt-2.5 p-3 rounded-2xl bg-purple-50/90 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 space-y-1.5 text-xs text-purple-950 dark:text-slate-200">
            {rationales && rationales.length > 0 ? (
              rationales.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-purple-950 dark:text-emerald-300 font-medium">
                  <span>{r}</span>
                </div>
              ))
            ) : (
              <p className="text-purple-800 dark:text-slate-400">High skill & availability synergy detected by algorithm.</p>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onOpenSwapModal(match)}
          className="w-full mt-4 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-pink-500 via-purple-500 to-sky-400 hover:from-pink-600 hover:to-sky-500 shadow-md flex items-center justify-center gap-2 transition-all duration-200"
        >
          <ArrowLeftRight className="w-4 h-4" /> Send Skill Swap Request
        </button>
      </div>

    </div>
  );
}
