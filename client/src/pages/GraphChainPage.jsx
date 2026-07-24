import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Share2, ArrowRight, Sparkles, User, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function GraphChainPage() {
  const [chains, setChains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChains = async () => {
      setLoading(true);
      try {
        const { data } = await API.get('/matches/chains');
        setChains(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChains();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-pink-500/30 text-xs font-bold text-pink-600 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Bonus Feature: Directed Graph Cycle Detection
        </div>
        <h1 className="heading-font text-3xl font-black text-pink-950 flex items-center gap-2.5">
          <Share2 className="w-7 h-7 text-pink-600" /> Indirect Multi-User Skill Exchange Chains
        </h1>
        <p className="text-xs text-purple-800 font-medium mt-1 max-w-3xl">
          When direct 1-to-1 matching isn't enough, SideQuest's graph engine discovers 3-way circular trade loops (A teaches B, B teaches C, C teaches A) so everyone learns what they want!
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-pink-600 font-semibold">
          <RefreshCw className="w-6 h-6 text-pink-500 animate-spin mx-auto mb-2" />
          Analyzing graph nodes and scanning cycles...
        </div>
      ) : chains.length > 0 ? (
        <div className="space-y-6">
          {chains.map((chain, index) => (
            <div key={index} className="glass-panel rounded-3xl p-6 border border-pink-200/70 shadow-2xl relative overflow-hidden">
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-pink-700 bg-pink-100/80 border border-pink-300 px-3 py-1 rounded-full">
                  {chain.chainLength}-Way Circular Exchange Chain
                </span>
                <span className="text-xs text-purple-800 font-medium">3 Users • 100% Loop Coverage</span>
              </div>

              {/* Chain Steps Flow */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center my-6">
                {chain.steps.map((step, sIdx) => (
                  <div key={sIdx} className="p-4 rounded-2xl glass-panel border border-pink-200/60 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold text-purple-700">Step {sIdx + 1}</span>
                      <ArrowRight className="w-4 h-4 text-pink-500 md:hidden" />
                    </div>

                    <div className="font-extrabold text-sm text-pink-950">
                      <strong className="text-purple-700">{step.teacherName}</strong> teaches <strong className="text-pink-600">{step.studentName}</strong>
                    </div>

                    <div className="mt-2 text-xs font-bold text-pink-700 bg-pink-50 p-2 rounded-xl border border-pink-200">
                      Skill Exchanged: {step.skillExchanged}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Loop Ribbon */}
              <div className="p-3.5 rounded-2xl glass-panel border border-pink-200 text-xs font-bold text-pink-950 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-600" />
                  <span>Cycle Summary: {chain.summary}</span>
                </div>
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-sky-400 hover:from-pink-600 hover:to-sky-500 text-white font-extrabold text-xs shadow-md">
                  Propose 3-Way Exchange Group
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center border border-pink-200 max-w-md mx-auto">
          <Share2 className="w-10 h-10 text-pink-400 mx-auto mb-3 opacity-60" />
          <h3 className="font-extrabold text-base text-pink-950">No 3-Way Chains Detected</h3>
          <p className="text-xs text-purple-700 mt-1">Add more users or teaching/learning skills to generate 3-way circular loops!</p>
        </div>
      )}

    </div>
  );
}
