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
    <div className="glass-panel rounded-2xl p-4 border border-indigo-500/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white">Level {currentLevel} Adventurer</h4>
            <p className="text-[11px] text-slate-400">{currentXP} total XP earned</p>
          </div>
        </div>
        <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-500/30">
          {xpForNextLevel - currentXP} XP to Level {currentLevel + 1}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800 relative overflow-hidden my-3">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 rounded-full transition-all duration-500 shadow-glow"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Badges Shelf */}
      <div className="pt-2 border-t border-slate-800/80">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-2">
          Unlocked Badges ({user.badges?.length || 0})
        </span>
        <div className="flex flex-wrap gap-2">
          {user.badges && user.badges.length > 0 ? (
            user.badges.map((badgeName) => {
              const IconComponent = BADGE_ICONS[badgeName] || Award;
              return (
                <div
                  key={badgeName}
                  className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-xl text-xs font-semibold text-amber-300 shadow-sm"
                  title={`Badge: ${badgeName}`}
                >
                  <IconComponent className="w-3.5 h-3.5 text-amber-400" />
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
