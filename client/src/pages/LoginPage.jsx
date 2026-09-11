import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogIn, Key, UserCheck, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(emailOrUsername, password);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Invalid username/email or password');
    }
  };

  const handleDemoLogin = async (identifier) => {
    setLoading(true);
    setError('');
    try {
      await login(identifier, 'password123');
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Demo login failed. Make sure server is running.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full rounded-3xl p-8 border border-[#DFC3E3] dark:border-[#2D3148] shadow-2xl relative bg-white dark:bg-[#181B29]">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#7CA1D9] mx-auto flex items-center justify-center shadow-sm mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="heading-font text-2xl font-extrabold text-slate-900 dark:text-white">Welcome Back to SideQuest</h2>
          <p className="text-xs text-slate-600 dark:text-[#D7C8E9] mt-1">Sign in to manage your skill swaps & sessions</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#E7B5D3]/20 border border-[#E7B5D3] text-xs text-slate-900 dark:text-[#E7B5D3]">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1.5">
              Username or Email
            </label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="e.g. trisha_dev or trisha@sidequest.com"
              className="w-full glass-input rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white bg-white dark:bg-[#141724]"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9]">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-[#7CA1D9] hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full glass-input rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white bg-white dark:bg-[#141724]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#7CA1D9] hover:bg-[#6B90CB] text-xs font-extrabold text-white shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        {/* 1-Click Quick Demo Users */}
        <div className="mt-8 pt-6 border-t border-[#DFC3E3] dark:border-[#2D3148]">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600 dark:text-[#D7C8E9] block mb-3 text-center">
            ⚡ Quick 1-Click Demo Accounts
          </span>
          <div className="space-y-2">
            <button
              onClick={() => handleDemoLogin('trisha_dev')}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#141724] border border-[#DFC3E3] dark:border-[#2D3148] hover:border-[#7CA1D9] text-xs text-left font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#7CA1D9]" /> Trisha (Full-Stack Dev)
              </span>
              <span className="text-[10px] text-[#7CA1D9] font-bold">1-Click Login →</span>
            </button>

            <button
              onClick={() => handleDemoLogin('elena_music')}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#141724] border border-[#DFC3E3] dark:border-[#2D3148] hover:border-[#7CA1D9] text-xs text-left font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#E7B5D3]" /> Elena (Guitar Tutor)
              </span>
              <span className="text-[10px] text-[#E7B5D3] font-bold">1-Click Login →</span>
            </button>

            <button
              onClick={() => handleDemoLogin('admin')}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#141724] border border-[#DFC3E3] dark:border-[#2D3148] hover:border-[#7CA1D9] text-xs text-left font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#BEC3EA]" /> Admin Console Account
              </span>
              <span className="text-[10px] text-[#BEC3EA] font-bold">Admin Login →</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-600 dark:text-[#D7C8E9] mt-6">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-[#7CA1D9] font-bold hover:underline">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}
