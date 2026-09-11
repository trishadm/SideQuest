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
        ? 'bg-[#BEC3EA]/20 dark:bg-[#141724] border-[#BEC3EA]/50 dark:border-[#2D3148] hover:border-[#7CA1D9]'
        : 'bg-[#D7C8E9]/20 dark:bg-[#141724] border-[#D7C8E9]/50 dark:border-[#2D3148] hover:border-[#7CA1D9]'
      }`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">{skill.name}</h5>
            {isTeach && skill.verificationStatus === 'Verified' && (
              <span className="inline-flex items-center text-[10px] font-bold text-slate-800 dark:text-[#BEC3EA] bg-[#BEC3EA]/30 border border-[#BEC3EA]/60 px-2 py-0.5 rounded-full gap-1" title="Verified Proof Uploaded">
                <ShieldCheck className="w-3 h-3 text-[#7CA1D9]" /> Verified
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-600 dark:text-[#D7C8E9] block mt-0.5">{skill.category}</span>
        </div>

        {/* Level Indicator Pill */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#181B29] border border-[#DFC3E3] dark:border-[#2D3148] px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-800 dark:text-[#D7C8E9] shadow-sm">
          <Star className="w-3 h-3 text-[#7CA1D9] fill-current" />
          <span>{LEVEL_LABELS[level] || `Lvl ${level}`}</span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#DFC3E3]/60 dark:border-[#2D3148] flex items-center justify-between text-[11px] text-slate-600 dark:text-[#D7C8E9] font-medium">
        {isTeach ? (
          <>
            <span>{skill.yearsOfExperience || 1} yrs exp • {skill.teachingMode || 'Both'}</span>
            {skill.proofUrl && (
              <a
                href={skill.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#7CA1D9] hover:underline font-bold"
              >
                {skill.proofType || 'Proof'} <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </>
        ) : (
          <>
            <span>Goal: <strong className="text-slate-900 dark:text-white font-extrabold">{skill.goal}</strong></span>
            <span className="font-bold text-[#7CA1D9]">
              {skill.priority} Priority
            </span>
          </>
        )}
      </div>
    </div>
  );
}
