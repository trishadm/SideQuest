import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeftRight,
  ShieldCheck,
  Users,
  Zap,
  Award,
  Code,
  Music,
  Languages,
  Palette,
  Briefcase,
  Dumbbell,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function LandingPage() {
  const categories = [
    { name: 'Programming & Tech', icon: Code, color: 'from-blue-500 to-indigo-600', count: '140+ mentors' },
    { name: 'Music & Audio', icon: Music, color: 'from-purple-500 to-pink-600', count: '85+ tutors' },
    { name: 'Languages', icon: Languages, color: 'from-amber-500 to-orange-600', count: '110+ speakers' },
    { name: 'Design & Arts', icon: Palette, color: 'from-emerald-500 to-teal-600', count: '95+ designers' },
    { name: 'Business & Strategy', icon: Briefcase, color: 'from-cyan-500 to-blue-600', count: '60+ experts' },
    { name: 'Fitness & Wellness', icon: Dumbbell, color: 'from-rose-500 to-red-600', count: '45+ trainers' }
  ];

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-xs font-bold text-indigo-300 mb-8 shadow-glow">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Zero Payment • Pure Peer-to-Peer Skill Exchange</span>
          </div>

          <h1 className="heading-font text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-pink-950 dark:text-white max-w-4xl mx-auto leading-tight">
            Teach What You Know.<br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-violet-300 dark:to-cyan-400 bg-clip-text text-transparent">
              Learn What You Love.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            SideQuest intelligently connects you with mentors and learners based on complementary skills, availability, and location. No money exchanged—ever.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-base shadow-glow flex items-center gap-3 transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5 text-white" /> Start Swapping Skills Free
            </Link>
            <Link
              to="/discover"
              className="px-8 py-4 rounded-2xl glass-panel border border-slate-700 hover:border-indigo-500/50 text-slate-200 font-bold text-base transition-all hover:bg-slate-800"
            >
              Explore Live Matches
            </Link>
          </div>

          {/* Stats Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="block heading-font text-3xl font-extrabold text-indigo-400">100%</span>
              <span className="text-xs text-slate-400 font-medium mt-1 block">Free Skill Trading</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="block heading-font text-3xl font-extrabold text-cyan-400">96%</span>
              <span className="text-xs text-slate-400 font-medium mt-1 block">Match Accuracy</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="block heading-font text-3xl font-extrabold text-violet-400">6-Tier</span>
              <span className="text-xs text-slate-400 font-medium mt-1 block">Weighted Scoring</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="block heading-font text-3xl font-extrabold text-emerald-400">Real-Time</span>
              <span className="text-xs text-slate-400 font-medium mt-1 block">Chat & Sessions</span>
            </div>
          </div>

        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="heading-font text-3xl sm:text-4xl font-extrabold text-white">How SideQuest Works</h2>
            <p className="text-sm text-slate-400 mt-3">Four simple steps to start exchanging knowledge with verified peers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 font-black text-xl flex items-center justify-center mb-4 border border-indigo-500/30">
                1
              </div>
              <h3 className="font-extrabold text-base text-white mb-2">Create Profile & Skills</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Add skills you can teach (with proof links) and skills you want to learn with target goals.</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 font-black text-xl flex items-center justify-center mb-4 border border-cyan-500/30">
                2
              </div>
              <h3 className="font-extrabold text-base text-white mb-2">Smart Match Discovery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Our 6-factor algorithm ranks partners by teach/learn fit, level, schedule, location & rating.</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 font-black text-xl flex items-center justify-center mb-4 border border-violet-500/30">
                3
              </div>
              <h3 className="font-extrabold text-base text-white mb-2">Send Swap Request</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Propose a 1-on-1 swap. Once accepted, unlock private real-time chat and session tracker.</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 font-black text-xl flex items-center justify-center mb-4 border border-emerald-500/30">
                4
              </div>
              <h3 className="font-extrabold text-base text-white mb-2">Complete & Earn XP</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Track session milestones, leave multi-criteria reviews, and level up your Adventurer badge status!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skill Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="heading-font text-3xl font-extrabold text-white">Popular Skill Categories</h2>
              <p className="text-sm text-slate-400 mt-2">Explore hundreds of skills ready to trade today.</p>
            </div>
            <Link to="/discover" className="mt-4 sm:mt-0 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View All Categories →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/discover?category=${encodeURIComponent(cat.name)}`}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border border-slate-800 flex items-center gap-4 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition-colors">{cat.name}</h4>
                  <span className="text-xs text-slate-400">{cat.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/80 text-center text-xs text-slate-500 glass-panel">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 SideQuest Platform. Built with React, Vite, Tailwind CSS, Node.js, Express & Socket.io.</p>
        </div>
      </footer>

    </div>
  );
}
