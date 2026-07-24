import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import API from '../services/api';
import {
  Sparkles,
  Search,
  MessageSquare,
  ArrowLeftRight,
  BookOpen,
  Award,
  Bell,
  User,
  LogOut,
  ShieldCheck,
  Share2,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { liveNotifications } = useSocket();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const { data } = await API.get('/notifications');
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, [user, liveNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: 'Matches', path: '/discover', icon: Sparkles },
    { name: 'Swaps', path: '/swaps', icon: ArrowLeftRight },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Sessions', path: '/sessions', icon: BookOpen },
    { name: 'Chain Graph', path: '/chains', icon: Share2 }
  ];

  if (user && user.role === 'admin') {
    navLinks.push({ name: 'Admin Console', path: '/admin', icon: ShieldCheck });
  }

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="heading-font text-xl font-extrabold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Side<span className="text-indigo-400">Quest</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-cyan-400 -mt-1">
                Skill Exchange
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Action Icons & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Level / XP Pill */}
                <div className="flex items-center gap-2 bg-indigo-950/40 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs">
                  <Award className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="font-bold text-amber-300">Lvl {user.level || 1}</span>
                    <span className="text-slate-400 text-[11px] ml-1.5">({user.xp || 0} XP)</span>
                  </div>
                </div>

                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl glass-panel border border-pink-500/30 hover:border-pink-400 transition-all flex items-center gap-2 text-xs font-extrabold shadow-sm"
                  title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span className="hidden sm:inline text-amber-300">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-purple-600" />
                      <span className="hidden sm:inline text-purple-700">Dark Mode</span>
                    </>
                  )}
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="p-2 rounded-xl glass-panel border border-pink-500/20 text-slate-300 hover:text-white hover:border-pink-400 transition-colors relative"
                  >
                    <Bell className="w-5 h-5 text-pink-400" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold flex items-center justify-center text-white animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl p-4 shadow-2xl z-50 border border-pink-500/30">
                      <div className="flex items-center justify-between pb-3 border-b border-pink-900/40">
                        <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                          <Bell className="w-4 h-4 text-pink-400" /> Notifications
                        </h4>
                        <button onClick={markAllRead} className="text-xs text-pink-400 hover:underline font-bold">
                          Mark all as read
                        </button>
                      </div>

                      <div className="max-h-72 overflow-y-auto space-y-2.5 mt-3 pr-1">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-6">No notifications yet</p>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id || Math.random()}
                              onClick={() => {
                                setShowNotifications(false);
                                if (n.link) navigate(n.link);
                              }}
                              className={`p-3 rounded-xl border transition-colors cursor-pointer text-xs ${n.isRead ? 'bg-black/20 border-pink-900/30 text-slate-400' : 'bg-pink-950/40 border-pink-500/30 text-slate-200'
                                }`}
                            >
                              <div className="font-semibold text-white mb-0.5">{n.title}</div>
                              <div className="text-slate-300">{n.message}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Pill Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl glass-panel border border-pink-500/30 hover:border-pink-400 transition-all"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover border border-purple-400"
                    />
                    <div className="text-left hidden lg:block pr-1">
                      <div className="text-xs font-bold text-slate-200 leading-tight">{user.name}</div>
                      <div className="text-[10px] text-pink-400 font-semibold">@{user.username}</div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl p-2 shadow-2xl z-50 border border-pink-500/30">
                      <Link
                        to={`/profile/${user.username}`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-pink-600/20 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4 text-pink-400" /> View Profile
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-pink-950/40 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 shadow-glow transition-all"
                >
                  Join SideQuest
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl glass-panel border border-pink-500/30 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && user && (
        <div className="md:hidden glass-panel border-t border-pink-500/30 px-4 py-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-pink-900/30">
            <span className="text-xs font-bold text-slate-300">Theme</span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl glass-panel border border-pink-500/30 text-xs font-extrabold flex items-center gap-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
              <span>{theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-pink-600/20"
            >
              <link.icon className="w-5 h-5 text-pink-400" /> {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-pink-900/30 flex items-center justify-between">
            <Link
              to={`/profile/${user.username}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 text-sm font-bold text-white"
            >
              <img src={user.avatar} className="w-8 h-8 rounded-lg" alt="" />
              <span>{user.name}</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="text-xs text-rose-400 font-bold"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
