import React from 'react';
import { Star, CheckCircle, ExternalLink, ShieldCheck, Award, BookOpen } from 'lucide-react';

const LEVEL_LABELS = {
  1: 'Novice (L1)',
  2: 'Beginner (L2)',
  3: 'Intermediate (L3)',
  4: 'Advanced (L4)',
  5: 'Expert (L5)'
};

export default function SkillBadge({ skill, type = 'teach' }) {
  if (!skill) return null;

  const isTeach = type === 'teach';
  const level = isTeach ? skill.level : skill.desiredLevel;

  return (
    <div className={`p-3.5 rounded-2xl border transition-all duration-200 ${isTeach
        ? 'bg-pink-50/80 dark:bg-purple-950/40 border-pink-200/80 dark:border-pink-900/40 hover:border-pink-300'
        : 'bg-purple-50/80 dark:bg-pink-950/30 border-purple-200/80 dark:border-purple-900/40 hover:border-purple-300'
      }`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h5 className="font-extrabold text-sm text-pink-950 dark:text-white">{skill.name}</h5>
            {isTeach && skill.verificationStatus === 'Verified' && (
              <span className="inline-flex items-center text-[10px] font-bold text-pink-700 dark:text-pink-300 bg-pink-100 dark:bg-pink-950/70 border border-pink-300 dark:border-pink-800 px-2 py-0.5 rounded-full gap-1" title="Verified Proof Uploaded">
                <ShieldCheck className="w-3 h-3 text-pink-600" /> Verified
              </span>
            )}
          </div>
          <span className="text-[11px] text-purple-800 dark:text-slate-400 block mt-0.5">{skill.category}</span>
        </div>

        {/* Level Indicator Pill */}
        <div className="flex items-center gap-1 bg-white dark:bg-purple-900/80 border border-purple-200 dark:border-purple-700 px-2.5 py-1 rounded-xl text-[11px] font-bold text-purple-900 dark:text-purple-200 shadow-2xs">
          <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
          <span>{LEVEL_LABELS[level] || `Lvl ${level}`}</span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-pink-200/60 dark:border-pink-900/30 flex items-center justify-between text-[11px] text-purple-900 dark:text-slate-400 font-medium">
        {isTeach ? (
          <>
            <span>{skill.yearsOfExperience || 1} yrs exp • {skill.teachingMode || 'Both'}</span>
            {skill.proofUrl && (
              <a
                href={skill.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-pink-600 dark:text-pink-400 hover:underline font-bold"
              >
                {skill.proofType || 'Proof'} <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </>
        ) : (
          <>
            <span>Goal: <strong className="text-pink-950 dark:text-slate-200 font-extrabold">{skill.goal}</strong></span>
            <span className={`font-bold ${skill.priority === 'High' ? 'text-pink-600 dark:text-rose-400' : skill.priority === 'Medium' ? 'text-purple-600 dark:text-amber-400' : 'text-purple-800 dark:text-slate-400'
              }`}>
              {skill.priority} Priority
            </span>
          </>
        )}
      </div>
    </div>
  );
}
