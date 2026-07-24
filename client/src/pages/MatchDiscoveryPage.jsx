import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MatchCard from '../components/MatchCard';
import SwapRequestModal from '../components/SwapRequestModal';
import { Sparkles, Search, Filter, SlidersHorizontal, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function MatchDiscoveryPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [category, setCategory] = useState('All');
  const [teachingMode, setTeachingMode] = useState('All');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  const [minRating, setMinRating] = useState('0');

  const [selectedMatchForSwap, setSelectedMatchForSwap] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const categories = [
    'All',
    'Programming & Tech',
    'Design & Arts',
    'Languages',
    'Music & Audio',
    'Business & Marketing',
    'Academics & Science',
    'Fitness & Wellness',
    'Crafts & Life Skills'
  ];

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (teachingMode !== 'All') params.append('teachingMode', teachingMode);
      if (location) params.append('location', location);
      if (language) params.append('language', language);
      if (minRating > 0) params.append('minRating', minRating);

      const { data } = await API.get(`/matches?${params.toString()}`);
      setMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [category, teachingMode, minRating]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMatches();
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 glass-panel border border-emerald-500/40 bg-emerald-950/80 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold text-emerald-200 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="heading-font text-3xl font-black text-white flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-cyan-400" /> Smart Match Discovery
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Explore candidates ranked by 6-tier weighted compatibility percentage.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Skill Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Teaching Mode
            </label>
            <select
              value={teachingMode}
              onChange={(e) => setTeachingMode(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="All" className="bg-slate-900">All Modes</option>
              <option value="Online" className="bg-slate-900">Online Only</option>
              <option value="Offline" className="bg-slate-900">Offline / In-Person</option>
              <option value="Both" className="bg-slate-900">Both</option>
            </select>
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              City / Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru"
              className="w-full glass-input rounded-xl px-3 py-2 text-xs"
            />
          </div>

          {/* Language Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Spoken Language
            </label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. English, Spanish"
              className="w-full glass-input rounded-xl px-3 py-2 text-xs"
            />
          </div>

          {/* Submit Search Button */}
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
            >
              <Search className="w-4 h-4" /> Filter Matches
            </button>
          </div>

        </form>
      </div>

      {/* Matches Feed Grid */}
      {loading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Calculating compatibility scores...</p>
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchCard
              key={match.user._id}
              match={match}
              onOpenSwapModal={(m) => setSelectedMatchForSwap(m)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 max-w-lg mx-auto">
          <Sparkles className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-60" />
          <h3 className="font-extrabold text-base text-white">No Matches Found for these Filters</h3>
          <p className="text-xs text-slate-400 mt-1">Try broadening your search filters or resetting location criteria.</p>
          <button
            onClick={() => {
              setCategory('All');
              setTeachingMode('All');
              setLocation('');
              setLanguage('');
              setMinRating('0');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-indigo-400 text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Swap Request Modal */}
      {selectedMatchForSwap && (
        <SwapRequestModal
          match={selectedMatchForSwap}
          onClose={() => setSelectedMatchForSwap(null)}
          onSuccess={() => {
            setSelectedMatchForSwap(null);
            showToast('Skill Swap Request Sent Successfully!');
          }}
        />
      )}

    </div>
  );
}
