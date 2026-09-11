import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import SkillBadge from '../components/SkillBadge';
import XPBar from '../components/XPBar';
import { 
  User, 
  MapPin, 
  Globe, 
  Calendar, 
  Star, 
  Plus, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  Award,
  BookOpen,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function ProfilePage() {
  const { identifier } = useParams();
  const { user: currentUser, updateUserProfile } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal forms for adding skill
  const [showTeachModal, setShowTeachModal] = useState(false);
  const [showLearnModal, setShowLearnModal] = useState(false);

  // Teach Skill form inputs
  const [teachName, setTeachName] = useState('');
  const [teachCategory, setTeachCategory] = useState('Programming & Tech');
  const [teachLevel, setTeachLevel] = useState(3);
  const [yearsOfExperience, setYearsOfExperience] = useState(2);
  const [teachingMode, setTeachingMode] = useState('Both');
  const [proofUrl, setProofUrl] = useState('');
  const [proofType, setProofType] = useState('GitHub');

  // Learn Skill form inputs
  const [learnName, setLearnName] = useState('');
  const [learnCategory, setLearnCategory] = useState('Music & Audio');
  const [desiredLevel, setDesiredLevel] = useState(3);
  const [goal, setGoal] = useState('Hobby');
  const [priority, setPriority] = useState('High');

  const isOwnProfile = currentUser && profileUser && (currentUser._id === profileUser._id || currentUser.username === profileUser.username);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const targetId = identifier || currentUser?.username;
      const { data } = await API.get(`/users/${targetId}`);
      setProfileUser(data);

      const reviewRes = await API.get(`/reviews/user/${data._id}`);
      setReviews(reviewRes.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [identifier]);

  const handleAddTeachSkill = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/skills/teach', {
        name: teachName,
        category: teachCategory,
        level: parseInt(teachLevel),
        yearsOfExperience: parseInt(yearsOfExperience),
        teachingMode,
        proofUrl,
        proofType
      });
      setShowTeachModal(false);
      setTeachName('');
      setProofUrl('');
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLearnSkill = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/skills/learn', {
        name: learnName,
        category: learnCategory,
        desiredLevel: parseInt(desiredLevel),
        goal,
        priority
      });
      setShowLearnModal(false);
      setLearnName('');
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTeachSkill = async (skillId) => {
    try {
      await API.delete(`/users/skills/teach/${skillId}`);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLearnSkill = async (skillId) => {
    try {
      await API.delete(`/users/skills/learn/${skillId}`);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xs text-[#7CA1D9] font-semibold">
        Loading user profile...
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center py-20 text-[#7CA1D9] font-semibold">
        User profile not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner & User Info */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#DFC3E3] dark:border-[#2D3148] relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={profileUser.avatar}
              alt={profileUser.name}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-[#7CA1D9]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="heading-font text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{profileUser.name}</h1>
                {profileUser.role === 'admin' && (
                  <span className="bg-[#7CA1D9]/20 text-[#7CA1D9] border border-[#7CA1D9]/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7CA1D9] font-bold mt-0.5">@{profileUser.username}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-[#D7C8E9] font-medium mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#7CA1D9]" /> {profileUser.location}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#7CA1D9]" /> {(profileUser.languages || []).join(', ')}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#7CA1D9]" /> {(profileUser.availability || []).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Rating Box */}
          <div className="glass-panel p-4 rounded-2xl border border-[#DFC3E3] dark:border-[#2D3148] text-center min-w-[140px]">
            <div className="flex items-center justify-center gap-1 text-[#7CA1D9] font-black text-2xl">
              <Star className="w-6 h-6 fill-current text-[#7CA1D9]" />
              <span>{(profileUser.ratings?.overall || 5.0).toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-slate-600 dark:text-[#D7C8E9] font-bold block mt-1">
              {profileUser.ratings?.totalReviews || 0} Peer Reviews
            </span>
          </div>
        </div>

        {/* Bio */}
        {profileUser.bio && (
          <p className="text-xs text-slate-700 dark:text-slate-200 font-medium mt-6 pt-4 border-t border-[#DFC3E3] dark:border-[#2D3148] leading-relaxed">
            "{profileUser.bio}"
          </p>
        )}
      </div>

      {/* Grid: Left 2 Cols (Skills & Reviews), Right 1 Col (XP Bar & Ratings Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* TEACHING SKILLS SECTION */}
          <div className="glass-panel rounded-3xl p-6 border border-[#DFC3E3] dark:border-[#2D3148]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#7CA1D9]" /> Skills {profileUser.name.split(' ')[0]} Teaches
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#D7C8E9]">Knowledge offered with verification proofs & levels.</p>
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => setShowTeachModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#7CA1D9] hover:bg-[#6B90CB] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Teaching Skill
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profileUser.teachingSkills && profileUser.teachingSkills.length > 0 ? (
                profileUser.teachingSkills.map((skill) => (
                  <div key={skill._id || skill.name} className="relative group">
                    <SkillBadge skill={skill} type="teach" />
                    {isOwnProfile && (
                      <button
                        onClick={() => handleDeleteTeachSkill(skill._id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500/90 text-white hover:bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic col-span-2 py-4">No teaching skills added yet.</p>
              )}
            </div>
          </div>

          {/* LEARNING SKILLS SECTION */}
          <div className="glass-panel rounded-3xl p-6 border border-[#DFC3E3] dark:border-[#2D3148]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#E7B5D3]" /> Skills {profileUser.name.split(' ')[0]} Wants To Learn
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#D7C8E9]">Target learning goals & priorities.</p>
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => setShowLearnModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#7CA1D9] hover:bg-[#6B90CB] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Learning Goal
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profileUser.learningSkills && profileUser.learningSkills.length > 0 ? (
                profileUser.learningSkills.map((skill) => (
                  <div key={skill._id || skill.name} className="relative group">
                    <SkillBadge skill={skill} type="learn" />
                    {isOwnProfile && (
                      <button
                        onClick={() => handleDeleteLearnSkill(skill._id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500/90 text-white hover:bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic col-span-2 py-4">No learning goals added yet.</p>
              )}
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="glass-panel rounded-3xl p-6 border border-[#DFC3E3] dark:border-[#2D3148]">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#7CA1D9] fill-current" /> Peer Reviews ({reviews.length})
            </h3>

            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-2xl glass-panel border border-[#DFC3E3] dark:border-[#2D3148] text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <img src={rev.reviewer?.avatar} className="w-8 h-8 rounded-xl object-cover border border-[#7CA1D9]" alt="" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{rev.reviewer?.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-[#D7C8E9]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#7CA1D9] text-sm">{rev.overall}★ Overall</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 italic">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">No written reviews yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <XPBar user={profileUser} />

          {/* Multi-Criteria Ratings Breakdown */}
          <div className="glass-panel p-5 rounded-3xl border border-[#DFC3E3] dark:border-[#2D3148] space-y-2 text-xs">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#7CA1D9]" /> Rating Breakdown
            </h4>

            <div className="flex justify-between py-1 border-b border-[#DFC3E3]/60 dark:border-[#2D3148]">
              <span className="text-slate-600 dark:text-[#D7C8E9] font-medium">Teaching Quality</span>
              <span className="font-bold text-[#7CA1D9]">{(profileUser.ratings?.teachingQuality || 5.0).toFixed(1)}★</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#DFC3E3]/60 dark:border-[#2D3148]">
              <span className="text-slate-600 dark:text-[#D7C8E9] font-medium">Communication</span>
              <span className="font-bold text-[#7CA1D9]">{(profileUser.ratings?.communication || 5.0).toFixed(1)}★</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#DFC3E3]/60 dark:border-[#2D3148]">
              <span className="text-slate-600 dark:text-[#D7C8E9] font-medium">Knowledge Depth</span>
              <span className="font-bold text-[#7CA1D9]">{(profileUser.ratings?.knowledge || 5.0).toFixed(1)}★</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#DFC3E3]/60 dark:border-[#2D3148]">
              <span className="text-slate-600 dark:text-[#D7C8E9] font-medium">Friendliness & Patience</span>
              <span className="font-bold text-[#7CA1D9]">{(profileUser.ratings?.friendliness || 5.0).toFixed(1)}★</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600 dark:text-[#D7C8E9] font-medium">Punctuality</span>
              <span className="font-bold text-[#7CA1D9]">{(profileUser.ratings?.punctuality || 5.0).toFixed(1)}★</span>
            </div>
          </div>
        </div>

      </div>

      {/* Add Teaching Skill Modal */}
      {showTeachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel rounded-3xl max-w-md w-full p-6 border border-[#DFC3E3] dark:border-[#2D3148] shadow-2xl bg-white dark:bg-[#181B29]">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4">Add Skill to Teach</h3>
            <form onSubmit={handleAddTeachSkill} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1">Skill Name</label>
                <input
                  type="text"
                  value={teachName}
                  onChange={(e) => setTeachName(e.target.value)}
                  placeholder="e.g. Python, Docker, Guitar"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1">Category</label>
                  <select
                    value={teachCategory}
                    onChange={(e) => setTeachCategory(e.target.value)}
                    className="w-full glass-input rounded-xl px-2 py-2 text-xs bg-white dark:bg-[#141724] text-slate-900 dark:text-white"
                  >
                    <option value="Programming & Tech">Tech</option>
                    <option value="Music & Audio">Music</option>
                    <option value="Languages">Languages</option>
                    <option value="Design & Arts">Design</option>
                    <option value="Business & Marketing">Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1">Skill Level (1-5)</label>
                  <select
                    value={teachLevel}
                    onChange={(e) => setTeachLevel(e.target.value)}
                    className="w-full glass-input rounded-xl px-2 py-2 text-xs bg-white dark:bg-[#141724] text-slate-900 dark:text-white"
                  >
                    <option value="1">1 - Novice</option>
                    <option value="2">2 - Beginner</option>
                    <option value="3">3 - Intermediate</option>
                    <option value="4">4 - Advanced</option>
                    <option value="5">5 - Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1">Proof URL (GitHub, Portfolio, LinkedIn)</label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeachModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[#DFC3E3] dark:border-[#2D3148] text-xs font-bold text-slate-700 dark:text-[#D7C8E9] hover:bg-slate-100 dark:hover:bg-[#212538]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#7CA1D9] hover:bg-[#6B90CB] text-xs font-bold text-white shadow-sm"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Learning Skill Modal */}
      {showLearnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel rounded-3xl max-w-md w-full p-6 border border-[#DFC3E3] dark:border-[#2D3148] shadow-2xl bg-white dark:bg-[#181B29]">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4">Add Skill to Learn</h3>
            <form onSubmit={handleAddLearnSkill} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1">Skill Name</label>
                <input
                  type="text"
                  value={learnName}
                  onChange={(e) => setLearnName(e.target.value)}
                  placeholder="e.g. Acoustic Guitar, Spanish"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1">Goal</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full glass-input rounded-xl px-2 py-2 text-xs bg-white dark:bg-[#141724] text-slate-900 dark:text-white"
                  >
                    <option value="Career">Career</option>
                    <option value="Interview">Interview</option>
                    <option value="College">College</option>
                    <option value="Hobby">Hobby</option>
                    <option value="Personal Interest">Personal Interest</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#D7C8E9] mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full glass-input rounded-xl px-2 py-2 text-xs bg-white dark:bg-[#141724] text-slate-900 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLearnModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[#DFC3E3] dark:border-[#2D3148] text-xs font-bold text-slate-700 dark:text-[#D7C8E9] hover:bg-slate-100 dark:hover:bg-[#212538]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#7CA1D9] hover:bg-[#6B90CB] text-xs font-bold text-white shadow-sm"
                >
                  Save Learning Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
