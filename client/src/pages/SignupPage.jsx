import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, UserPlus, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Bengaluru, India');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup({
        name,
        username,
        email,
        password,
        location,
        bio
      });

      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed';
      console.error('Signup form error:', err.response?.data || err);
      setError(serverMsg);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 my-6">
      <div className="glass-panel max-w-lg w-full rounded-3xl p-8 border border-slate-800 shadow-2xl relative">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 mx-auto flex items-center justify-center shadow-glow mb-3">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="heading-font text-2xl font-extrabold text-white">Join SideQuest</h2>
          <p className="text-xs text-slate-400 mt-1">Start exchanging skills with peers around the world</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Trisha Sharma"
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. trisha_dev"
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trisha@example.com"
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Location / City
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru, India or Remote"
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Short Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Briefly introduce yourself and what skills you love trading!"
              className="w-full glass-input rounded-xl p-3 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-xs font-extrabold text-white shadow-glow flex items-center justify-center gap-2 transition-all mt-2"
          >
            {loading ? 'Creating Account...' : (
              <>
                <UserPlus className="w-4 h-4" /> Create SideQuest Profile
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
}
