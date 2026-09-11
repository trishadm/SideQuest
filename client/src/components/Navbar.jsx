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
    { name: 'Sessions', path: '/sessions', icon: BookOpen }
  ];

  if (user && user.role === 'admin') {
    navLinks.push({ name: 'Admin Console', path: '/admin', icon: ShieldCheck });
  }

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-[#DFC3E3] dark:border-[#2D3148]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#7CA1D9] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="heading-font text-xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
                Side<span className="text-[#7CA1D9]">Quest</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#7CA1D9] -mt-1">
                Skill Exchange
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-[#141724] p-1.5 rounded-2xl border border-[#DFC3E3] dark:border-[#2D3148]">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${isActive
                        ? 'bg-[#7CA1D9] text-white shadow-sm'
                        : 'text-slate-600 dark:text-[#D7C8E9] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#1E2235]'
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
                <div className="flex items-center gap-2 bg-[#D7C8E9]/20 border border-[#DFC3E3] dark:border-[#2D3148] px-3 py-1.5 rounded-xl text-xs">
                  <Award className="w-4 h-4 text-[#7CA1D9]" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-[#D7C8E9]">Lvl {user.level || 1}</span>
                    <span className="text-slate-500 dark:text-[#BEC3EA] text-[11px] ml-1.5">({user.xp || 0} XP)</span>
                  </div>
                </div>

                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl glass-panel border border-[#DFC3E3] dark:border-[#2D3148] hover:border-[#7CA1D9] transition-all flex items-center gap-2 text-xs font-extrabold shadow-sm text-slate-800 dark:text-slate-200"
                  title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-[#7CA1D9]" />
                      <span className="hidden sm:inline text-[#D7C8E9]">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-[#7CA1D9]" />
                      <span className="hidden sm:inline text-slate-800">Dark Mode</span>
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
                    className="p-2 rounded-xl glass-panel border border-[#DFC3E3] dark:border-[#2D3148] text-slate-700 dark:text-[#D7C8E9] hover:text-slate-900 dark:hover:text-white hover:border-[#7CA1D9] transition-colors relative"
                  >
                    <Bell className="w-5 h-5 text-[#7CA1D9]" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E7B5D3] text-[10px] font-bold flex items-center justify-center text-slate-900">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl p-4 shadow-2xl z-50 border border-[#DFC3E3] dark:border-[#2D3148]">
                      <div className="flex items-center justify-between pb-3 border-b border-[#DFC3E3] dark:border-[#2D3148]">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Bell className="w-4 h-4 text-[#7CA1D9]" /> Notifications
                        </h4>
                        <button onClick={markAllRead} className="text-xs text-[#7CA1D9] hover:underline font-bold">
                          Mark all as read
                        </button>
                      </div>

                      <div className="max-h-72 overflow-y-auto space-y-2.5 mt-3 pr-1">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-500 dark:text-[#D7C8E9] text-center py-6">No notifications yet</p>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id || Math.random()}
                              onClick={() => {
                                setShowNotifications(false);
                                if (n.link) navigate(n.link);
                              }}
                              className={`p-3 rounded-xl border transition-colors cursor-pointer text-xs ${n.isRead ? 'bg-slate-50 dark:bg-[#141724] border-[#DFC3E3]/40 dark:border-[#2D3148] text-slate-600 dark:text-slate-400' : 'bg-[#BEC3EA]/20 dark:bg-[#1E2235] border-[#7CA1D9] text-slate-900 dark:text-white'
                                }`}
                            >
                              <div className="font-semibold text-slate-900 dark:text-white mb-0.5">{n.title}</div>
                              <div className="text-slate-600 dark:text-[#D7C8E9]">{n.message}</div>
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
                    className="flex items-center gap-2.5 p-1.5 rounded-xl glass-panel border border-[#DFC3E3] dark:border-[#2D3148] hover:border-[#7CA1D9] transition-all"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover border border-[#7CA1D9]"
                    />
                    <div className="text-left hidden lg:block pr-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user.name}</div>
                      <div className="text-[10px] text-[#7CA1D9] font-semibold">@{user.username}</div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl p-2 shadow-2xl z-50 border border-[#DFC3E3] dark:border-[#2D3148]">
                      <Link
                        to={`/profile/${user.username}`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-[#BEC3EA]/30 dark:hover:bg-[#212538] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#7CA1D9]" /> View Profile
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#E7B5D3] hover:bg-[#E7B5D3]/10 transition-colors"
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#D7C8E9] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#181B29] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#7CA1D9] hover:bg-[#6B90CB] shadow-sm transition-all"
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
              className="p-2 rounded-xl glass-panel border border-[#DFC3E3] dark:border-[#2D3148] text-slate-700 dark:text-[#D7C8E9]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && user && (
        <div className="md:hidden glass-panel border-t border-[#DFC3E3] dark:border-[#2D3148] px-4 py-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DFC3E3] dark:border-[#2D3148]">
            <span className="text-xs font-bold text-slate-700 dark:text-[#D7C8E9]">Theme</span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl glass-panel border border-[#DFC3E3] dark:border-[#2D3148] text-xs font-extrabold flex items-center gap-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#7CA1D9]" /> : <Moon className="w-4 h-4 text-[#7CA1D9]" />}
              <span>{theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-[#BEC3EA]/20"
            >
              <link.icon className="w-5 h-5 text-[#7CA1D9]" /> {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#DFC3E3] dark:border-[#2D3148] flex items-center justify-between">
            <Link
              to={`/profile/${user.username}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-white"
            >
              <img src={user.avatar} className="w-8 h-8 rounded-lg" alt="" />
              <span>{user.name}</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="text-xs text-[#E7B5D3] font-bold"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
