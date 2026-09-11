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
    return <div className="text-center py-20 text-xs text-slate-500 dark:text-[#D7C8E9]">Loading admin console analytics...</div>;
  }

  const { summary, popularSkills, requestedSkills, monthlyGrowth } = stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="heading-font text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-[#7CA1D9]" /> Admin & Analytics Console
        </h1>
        <p className="text-xs text-slate-600 dark:text-[#D7C8E9] mt-1">
          Monitor platform metrics, skill demand, monthly growth, and account moderation.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148]">
          <div className="w-10 h-10 rounded-xl bg-[#7CA1D9]/20 text-[#7CA1D9] flex items-center justify-center mb-3 border border-[#7CA1D9]/30">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">{summary?.totalUsers || 0}</span>
          <span className="text-xs text-slate-600 dark:text-[#D7C8E9]">Registered Users</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148]">
          <div className="w-10 h-10 rounded-xl bg-[#BEC3EA]/30 text-slate-800 dark:text-[#BEC3EA] flex items-center justify-center mb-3 border border-[#BEC3EA]/40">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">{summary?.activeSwaps || 0}</span>
          <span className="text-xs text-slate-600 dark:text-[#D7C8E9]">Active Skill Swaps</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148]">
          <div className="w-10 h-10 rounded-xl bg-[#D7C8E9]/30 text-slate-800 dark:text-[#D7C8E9] flex items-center justify-center mb-3 border border-[#D7C8E9]/40">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">{summary?.completedSessions || 0}</span>
          <span className="text-xs text-slate-600 dark:text-[#D7C8E9]">Completed Sessions</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148]">
          <div className="w-10 h-10 rounded-xl bg-[#E7B5D3]/30 text-slate-800 dark:text-[#E7B5D3] flex items-center justify-center mb-3 border border-[#E7B5D3]/40">
            <Star className="w-5 h-5 fill-current text-[#7CA1D9]" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">{(summary?.avgRating || 4.9).toFixed(1)}★</span>
          <span className="text-xs text-slate-600 dark:text-[#D7C8E9]">Avg Platform Rating ({summary?.totalReviews || 0} reviews)</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Popular Skills Taught */}
        <div className="glass-panel p-6 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148]">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#7CA1D9]" /> Most Popular Skills Taught
          </h3>
          <div className="space-y-3">
            {popularSkills?.map((skill, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{skill.name}</span>
                  <span className="text-[#7CA1D9] font-semibold">{skill.count} mentors</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-[#141724] rounded-full h-2 overflow-hidden border border-[#DFC3E3] dark:border-[#2D3148]">
                  <div
                    className="bg-[#7CA1D9] h-full rounded-full"
                    style={{ width: `${Math.min(skill.count * 15, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Requested Skills */}
        <div className="glass-panel p-6 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148]">
          <h3 className="font-extrabold text-sm text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#7CA1D9]" /> Most Requested Learning Skills
          </h3>
          <div className="space-y-3">
            {requestedSkills?.map((skill, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{skill.name}</span>
                  <span className="text-[#7CA1D9] font-semibold">{skill.count} requests</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-[#141724] rounded-full h-2 overflow-hidden border border-[#DFC3E3] dark:border-[#2D3148]">
                  <div
                    className="bg-[#7CA1D9] h-full rounded-full"
                    style={{ width: `${Math.min(skill.count * 15, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* User Moderation Management Table */}
      <div className="glass-panel rounded-3xl p-6 border border-[#DFC3E3] dark:border-[#2D3148]">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-[#7CA1D9]" /> User Accounts & Moderation Console
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DFC3E3] dark:border-[#2D3148] text-slate-600 dark:text-[#D7C8E9] uppercase tracking-wider font-bold text-[10px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFC3E3]/60 dark:divide-[#2D3148]">
              {usersList.map((usr) => (
                <tr key={usr._id} className="hover:bg-slate-100/50 dark:hover:bg-[#141724]/50 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={usr.avatar} className="w-8 h-8 rounded-xl object-cover border border-[#7CA1D9]" alt="" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{usr.name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-[#D7C8E9]">@{usr.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 capitalize">{usr.role}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-[#D7C8E9]">{usr.location}</td>
                  <td className="py-3 px-4 font-bold text-[#7CA1D9]">{(usr.ratings?.overall || 5.0).toFixed(1)}★</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      usr.isBanned ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' : 'bg-[#7CA1D9]/20 text-slate-800 dark:text-[#BEC3EA]'
                    }`}>
                      {usr.isBanned ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleBan(usr._id)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-colors ${
                        usr.isBanned
                          ? 'bg-[#7CA1D9] text-white hover:bg-[#6B90CB]'
                          : 'bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-200'
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
