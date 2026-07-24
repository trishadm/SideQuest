import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  ShieldCheck, 
  Users, 
  ArrowLeftRight, 
  BookOpen, 
  Star, 
  BarChart3, 
  TrendingUp, 
  Ban, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await API.get('/admin/stats');
      setStats(statsRes.data);

      const usersRes = await API.get('/admin/users');
      setUsersList(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleBan = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/ban`);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xs text-slate-400">Loading admin console analytics...</div>;
  }

  const { summary, popularSkills, requestedSkills, monthlyGrowth } = stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="heading-font text-3xl font-black text-white flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-cyan-400" /> Admin & Analytics Console
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Monitor platform metrics, skill demand, monthly growth, and account moderation.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/30">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-white block">{summary?.totalUsers || 0}</span>
          <span className="text-xs text-slate-400">Registered Users</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 border border-cyan-500/30">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-white block">{summary?.activeSwaps || 0}</span>
          <span className="text-xs text-slate-400">Active Skill Swaps</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-white block">{summary?.completedSessions || 0}</span>
          <span className="text-xs text-slate-400">Completed Sessions</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 border border-amber-500/30">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <span className="text-2xl font-black text-white block">{summary?.avgRating || 4.9}★</span>
          <span className="text-xs text-slate-400">Avg Platform Rating ({summary?.totalReviews || 0} reviews)</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Popular Skills Taught */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="font-extrabold text-sm text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" /> Most Popular Skills Taught
          </h3>
          <div className="space-y-3">
            {popularSkills?.map((skill, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-200">{skill.name}</span>
                  <span className="text-indigo-400 font-semibold">{skill.count} mentors</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${Math.min(skill.count * 15, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Requested Skills */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="font-extrabold text-sm text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" /> Most Requested Learning Skills
          </h3>
          <div className="space-y-3">
            {requestedSkills?.map((skill, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-200">{skill.name}</span>
                  <span className="text-cyan-400 font-semibold">{skill.count} requests</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-cyan-400 h-full rounded-full"
                    style={{ width: `${Math.min(skill.count * 15, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* User Moderation Management Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <h3 className="font-extrabold text-sm text-white mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" /> User Accounts & Moderation Console
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {usersList.map((usr) => (
                <tr key={usr._id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={usr.avatar} className="w-8 h-8 rounded-xl object-cover" alt="" />
                    <div>
                      <span className="font-bold text-white block">{usr.name}</span>
                      <span className="text-[10px] text-slate-400">@{usr.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-300 capitalize">{usr.role}</td>
                  <td className="py-3 px-4 text-slate-400">{usr.location}</td>
                  <td className="py-3 px-4 font-bold text-amber-400">{(usr.ratings?.overall || 5.0).toFixed(1)}★</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      usr.isBanned ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
                    }`}>
                      {usr.isBanned ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleBan(usr._id)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-colors ${
                        usr.isBanned
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                          : 'bg-rose-950/80 border border-rose-500/40 text-rose-400 hover:bg-rose-900/80'
                      }`}
                    >
                      {usr.isBanned ? 'Unban Account' : 'Ban / Remove'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
