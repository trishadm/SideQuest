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
    { name: 'Programming & Tech', icon: Code, color: 'bg-[#7CA1D9]', count: '140+ mentors' },
    { name: 'Music & Audio', icon: Music, color: 'bg-[#BEC3EA]', count: '85+ tutors' },
    { name: 'Languages', icon: Languages, color: 'bg-[#D7C8E9]', count: '110+ speakers' },
    { name: 'Design & Arts', icon: Palette, color: 'bg-[#DFC3E3]', count: '95+ designers' },
    { name: 'Business & Strategy', icon: Briefcase, color: 'bg-[#E7B5D3]', count: '60+ experts' },
    { name: 'Fitness & Wellness', icon: Dumbbell, color: 'bg-[#E7B6D4]', count: '45+ trainers' }
  ];

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-[#DFC3E3] dark:border-[#2D3148] text-xs font-bold text-slate-800 dark:text-[#D7C8E9] mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#7CA1D9]" />
            <span>Zero Payment • Pure Peer-to-Peer Skill Exchange</span>
          </div>

          <h1 className="heading-font text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Teach What You Know.<br />
            <span className="text-[#7CA1D9]">
              Learn What You Love.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-[#D7C8E9] max-w-2xl mx-auto font-normal leading-relaxed">
            SideQuest intelligently connects you with mentors and learners based on complementary skills, availability, and location. No money exchanged—ever.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-2xl bg-[#7CA1D9] hover:bg-[#6B90CB] text-white font-extrabold text-base shadow-sm flex items-center gap-3 transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5 text-white" /> Start Swapping Skills Free
            </Link>
            <Link
              to="/discover"
              className="px-8 py-4 rounded-2xl glass-panel border border-[#DFC3E3] dark:border-[#2D3148] hover:border-[#7CA1D9] text-slate-800 dark:text-slate-200 font-bold text-base transition-all"
            >
              Explore Live Matches
            </Link>
          </div>

          {/* Stats Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-5 rounded-2xl border border-[#DFC3E3] dark:border-[#2D3148]">
              <span className="block heading-font text-3xl font-extrabold text-[#7CA1D9]">100%</span>
              <span className="text-xs text-slate-600 dark:text-[#D7C8E9] font-medium mt-1 block">Free Skill Trading</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-[#DFC3E3] dark:border-[#2D3148]">
              <span className="block heading-font text-3xl font-extrabold text-[#7CA1D9]">96%</span>
              <span className="text-xs text-slate-600 dark:text-[#D7C8E9] font-medium mt-1 block">Match Accuracy</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-[#DFC3E3] dark:border-[#2D3148]">
              <span className="block heading-font text-3xl font-extrabold text-[#7CA1D9]">6-Tier</span>
              <span className="text-xs text-slate-600 dark:text-[#D7C8E9] font-medium mt-1 block">Weighted Scoring</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-[#DFC3E3] dark:border-[#2D3148]">
              <span className="block heading-font text-3xl font-extrabold text-[#7CA1D9]">Real-Time</span>
              <span className="text-xs text-slate-600 dark:text-[#D7C8E9] font-medium mt-1 block">Chat & Sessions</span>
            </div>
          </div>

        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-slate-100/50 dark:bg-[#141724]/50 border-y border-[#DFC3E3] dark:border-[#2D3148]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="heading-font text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">How SideQuest Works</h2>
            <p className="text-sm text-slate-600 dark:text-[#D7C8E9] mt-3">Four simple steps to start exchanging knowledge with verified peers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148] relative">
              <div className="w-12 h-12 rounded-2xl bg-[#7CA1D9]/20 text-[#7CA1D9] font-black text-xl flex items-center justify-center mb-4 border border-[#7CA1D9]/30">
                1
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">Create Profile & Skills</h3>
              <p className="text-xs text-slate-600 dark:text-[#D7C8E9] leading-relaxed">Add skills you can teach (with proof links) and skills you want to learn with target goals.</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148] relative">
              <div className="w-12 h-12 rounded-2xl bg-[#BEC3EA]/30 text-slate-900 dark:text-[#BEC3EA] font-black text-xl flex items-center justify-center mb-4 border border-[#BEC3EA]/40">
                2
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">Smart Match Discovery</h3>
              <p className="text-xs text-slate-600 dark:text-[#D7C8E9] leading-relaxed">Our 6-factor algorithm ranks partners by teach/learn fit, level, schedule, location & rating.</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148] relative">
              <div className="w-12 h-12 rounded-2xl bg-[#D7C8E9]/30 text-slate-900 dark:text-[#D7C8E9] font-black text-xl flex items-center justify-center mb-4 border border-[#D7C8E9]/40">
                3
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">Send Swap Request</h3>
              <p className="text-xs text-slate-600 dark:text-[#D7C8E9] leading-relaxed">Propose a 1-on-1 swap. Once accepted, unlock private real-time chat and session tracker.</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148] relative">
              <div className="w-12 h-12 rounded-2xl bg-[#E7B5D3]/30 text-slate-900 dark:text-[#E7B5D3] font-black text-xl flex items-center justify-center mb-4 border border-[#E7B5D3]/40">
                4
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">Complete & Earn XP</h3>
              <p className="text-xs text-slate-600 dark:text-[#D7C8E9] leading-relaxed">Track session milestones, leave multi-criteria reviews, and level up your Adventurer badge status!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skill Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="heading-font text-3xl font-extrabold text-slate-900 dark:text-white">Popular Skill Categories</h2>
              <p className="text-sm text-slate-600 dark:text-[#D7C8E9] mt-2">Explore hundreds of skills ready to trade today.</p>
            </div>
            <Link to="/discover" className="mt-4 sm:mt-0 text-xs font-bold text-[#7CA1D9] hover:underline flex items-center gap-1">
              View All Categories →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/discover?category=${encodeURIComponent(cat.name)}`}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148] flex items-center gap-4 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                  <cat.icon className="w-7 h-7 text-slate-900" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-[#7CA1D9] transition-colors">{cat.name}</h4>
                  <span className="text-xs text-slate-600 dark:text-[#D7C8E9]">{cat.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#DFC3E3] dark:border-[#2D3148] text-center text-xs text-slate-500 dark:text-[#D7C8E9]/70 glass-panel">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 SideQuest Platform. Built with React, Vite, Tailwind CSS, Node.js, Express & Socket.io.</p>
        </div>
      </footer>

    </div>
  );
}
