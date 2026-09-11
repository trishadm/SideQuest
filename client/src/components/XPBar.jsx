import React from 'react';
import { Award, Trophy, Zap, Heart, Sparkles } from 'lucide-react';

const BADGE_ICONS = {
  'First Swap': Sparkles,
  '10 Successful Swaps': Trophy,
  'Top Mentor': Award,
  'Quick Learner': Zap,
  'Community Helper': Heart
};

export default function XPBar({ user }) {
  if (!user) return null;

  const currentLevel = user.level || 1;
  const currentXP = user.xp || 0;
  const xpForCurrentLevel = (currentLevel - 1) * 250;
  const xpForNextLevel = currentLevel * 250;
  const progressPercent = Math.min(
    Math.max(Math.round(((currentXP - xpForCurrentLevel) / 250) * 100), 5),
    100
  );

  return (
    <div className="glass-panel rounded-2xl p-4 border border-[#DFC3E3] dark:border-[#2D3148]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#7CA1D9]/20 border border-[#7CA1D9]/40 flex items-center justify-center">
            <Award className="w-4 h-4 text-[#7CA1D9]" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Level {currentLevel} Adventurer</h4>
            <p className="text-[11px] text-slate-500 dark:text-[#D7C8E9]">{currentXP} total XP earned</p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#7CA1D9] bg-[#7CA1D9]/15 px-2.5 py-1 rounded-full border border-[#7CA1D9]/40">
          {xpForNextLevel - currentXP} XP to Level {currentLevel + 1}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-[#141724] rounded-full h-3 p-0.5 border border-[#DFC3E3] dark:border-[#2D3148] relative overflow-hidden my-3">
        <div
          className="h-full bg-[#7CA1D9] rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Badges Shelf */}
      <div className="pt-2 border-t border-[#DFC3E3] dark:border-[#2D3148]">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-[#D7C8E9] block mb-2">
          Unlocked Badges ({user.badges?.length || 0})
        </span>
        <div className="flex flex-wrap gap-2">
          {user.badges && user.badges.length > 0 ? (
            user.badges.map((badgeName) => {
              const IconComponent = BADGE_ICONS[badgeName] || Award;
              return (
                <div
                  key={badgeName}
                  className="flex items-center gap-1.5 bg-[#D7C8E9]/20 border border-[#D7C8E9]/50 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-800 dark:text-[#D7C8E9] shadow-sm"
                  title={`Badge: ${badgeName}`}
                >
                  <IconComponent className="w-3.5 h-3.5 text-[#7CA1D9]" />
                  <span>{badgeName}</span>
                </div>
              );
            })
          ) : (
            <span className="text-xs text-slate-500 italic">Complete your first swap to unlock badges!</span>
          )}
        </div>
      </div>
    </div>
  );
}
