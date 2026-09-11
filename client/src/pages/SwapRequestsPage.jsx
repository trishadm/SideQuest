import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  ArrowLeftRight, 
  Check, 
  X, 
  MessageSquare, 
  Clock, 
  Calendar, 
  Sparkles,
  RefreshCw,
  Send
} from 'lucide-react';

export default function SwapRequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'outgoing' | 'accepted'
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/swaps');
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (requestId, status) => {
    try {
      await API.put(`/swaps/${requestId}/respond`, { status });
      fetchRequests();
      if (status === 'Accepted') {
        navigate('/chat');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const incoming = requests.filter(r => r.receiver?._id === user._id && r.status === 'Pending');
  const outgoing = requests.filter(r => r.sender?._id === user._id && r.status === 'Pending');
  const accepted = requests.filter(r => r.status === 'Accepted');

  const displayedRequests = activeTab === 'incoming' 
    ? incoming 
    : activeTab === 'outgoing' 
    ? outgoing 
    : accepted;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="heading-font text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <ArrowLeftRight className="w-7 h-7 text-[#7CA1D9]" /> Skill Swap Requests
        </h1>
        <p className="text-xs text-slate-600 dark:text-[#D7C8E9] font-medium mt-1">
          Manage incoming proposals, pending outgoing requests, and active swap commitments.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 glass-panel p-1.5 rounded-2xl border border-[#DFC3E3] dark:border-[#2D3148] max-w-md">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex-1 py-2 rounded-xl text-xs transition-all ${
            activeTab === 'incoming'
              ? 'bg-[#7CA1D9] text-white shadow-sm font-extrabold'
              : 'text-slate-600 dark:text-[#D7C8E9] hover:text-slate-900 dark:hover:text-white font-semibold'
          }`}
        >
          Incoming ({incoming.length})
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex-1 py-2 rounded-xl text-xs transition-all ${
            activeTab === 'outgoing'
              ? 'bg-[#7CA1D9] text-white shadow-sm font-extrabold'
              : 'text-slate-600 dark:text-[#D7C8E9] hover:text-slate-900 dark:hover:text-white font-semibold'
          }`}
        >
          Sent ({outgoing.length})
        </button>

        <button
          onClick={() => setActiveTab('accepted')}
          className={`flex-1 py-2 rounded-xl text-xs transition-all ${
            activeTab === 'accepted'
              ? 'bg-[#7CA1D9] text-white shadow-sm font-extrabold'
              : 'text-slate-600 dark:text-[#D7C8E9] hover:text-slate-900 dark:hover:text-white font-semibold'
          }`}
        >
          Accepted ({accepted.length})
        </button>
      </div>

      {/* List Feed */}
      {loading ? (
        <div className="text-center py-16 text-xs text-[#7CA1D9] font-semibold">
          <RefreshCw className="w-6 h-6 text-[#7CA1D9] animate-spin mx-auto mb-2" />
          Loading requests...
        </div>
      ) : displayedRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedRequests.map((req) => {
            const isSender = req.sender?._id === user._id;
            const partner = isSender ? req.receiver : req.sender;

            return (
              <div key={req._id} className="glass-panel p-6 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148] space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={partner?.avatar} className="w-12 h-12 rounded-2xl object-cover border border-[#DFC3E3] dark:border-[#2D3148]" alt="" />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{partner?.name}</h4>
                      <span className="text-xs text-[#7CA1D9] font-bold">@{partner?.username}</span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    req.status === 'Accepted' 
                      ? 'bg-[#7CA1D9]/20 text-slate-800 dark:text-[#BEC3EA] border border-[#7CA1D9]/50'
                      : req.status === 'Pending'
                      ? 'bg-[#D7C8E9]/30 text-slate-800 dark:text-[#D7C8E9] border border-[#D7C8E9]/60'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  }`}>
                    {req.status}
                  </span>
                </div>

                {/* Exchange Pair Pill */}
                <div className="p-3.5 rounded-2xl glass-panel border border-[#DFC3E3] dark:border-[#2D3148] grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-[#D7C8E9] uppercase font-bold tracking-wider block mb-0.5">They Teach:</span>
                    <strong className="text-[#7CA1D9] font-extrabold">{req.requestedSkill}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-[#D7C8E9] uppercase font-bold tracking-wider block mb-0.5">You Teach:</span>
                    <strong className="text-[#E7B5D3] font-extrabold">{req.offeredSkill}</strong>
                  </div>
                </div>

                {/* Message */}
                <p className="text-xs text-slate-700 dark:text-slate-200 italic glass-panel p-3 rounded-xl border border-[#DFC3E3] dark:border-[#2D3148]">
                  "{req.message}"
                </p>

                {/* Availability & Duration */}
                <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-[#D7C8E9] font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#7CA1D9]" /> {req.availability}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#7CA1D9]" /> {req.preferredDuration}
                  </span>
                </div>

                {/* Action Buttons for Incoming Pending Requests */}
                {!isSender && req.status === 'Pending' && (
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleRespond(req._id, 'Rejected')}
                      className="flex-1 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-extrabold flex items-center justify-center gap-1 transition-colors"
                    >
                      <X className="w-4 h-4" /> Decline
                    </button>
                    <button
                      onClick={() => handleRespond(req._id, 'Accepted')}
                      className="flex-1 py-2.5 rounded-xl bg-[#7CA1D9] hover:bg-[#6B90CB] text-white text-xs font-extrabold flex items-center justify-center gap-1 shadow-sm transition-all"
                    >
                      <Check className="w-4 h-4" /> Accept & Start Chat
                    </button>
                  </div>
                )}

                {/* Shortcut to Chat if Accepted */}
                {req.status === 'Accepted' && (
                  <button
                    onClick={() => navigate('/chat')}
                    className="w-full py-2.5 rounded-xl bg-[#7CA1D9] hover:bg-[#6B90CB] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" /> Open Private Chat & Sessions
                  </button>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center border border-[#DFC3E3] dark:border-[#2D3148] max-w-md mx-auto">
          <ArrowLeftRight className="w-10 h-10 text-[#7CA1D9] mx-auto mb-3 opacity-60" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No Requests in this Tab</h3>
          <p className="text-xs text-slate-600 dark:text-[#D7C8E9] mt-1">Explore smart matches and send swap requests to connect!</p>
        </div>
      )}

    </div>
  );
}
