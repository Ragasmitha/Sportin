import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, followUser, unfollowUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [photo, setPhoto] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile(id);
        setProfile(data);
        setFormData({ name: data.name, bio: data.bio, sport: data.sport, location: data.location });
        setIsFollowing(data.followers.includes(user?._id));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [id, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('bio', formData.bio);
      form.append('sport', formData.sport);
      form.append('location', formData.location);
      if (photo) form.append('profilePhoto', photo);
      const { data } = await updateProfile(form);
      setProfile({ ...profile, ...data });
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(id);
        setIsFollowing(false);
        setProfile({ ...profile, followers: profile.followers.filter(f => f !== user._id) });
      } else {
        await followUser(id);
        setIsFollowing(true);
        setProfile({ ...profile, followers: [...profile.followers, user._id] });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  const isOwnProfile = user?._id === id;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-widest cursor-pointer" onClick={() => navigate('/dashboard')}>SPORTIN</h1>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 hover:text-white transition">← Dashboard</button>
      </nav>

      {/* Banner */}
      <div className="w-full h-40 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-800" />

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-6">
        {/* Avatar — overlapping banner */}
        <div className="flex items-end gap-6 -mt-16 mb-6">
          <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-black overflow-hidden flex-shrink-0">
            {profile?.profilePhoto ? (
              <img src={profile.profilePhoto} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                {profile?.name?.charAt(0)}
              </div>
            )}
          </div>
          <div className="mb-2 flex gap-3">
            {isOwnProfile ? (
              <button onClick={() => setEditing(!editing)} className="px-5 py-2 bg-white text-black font-bold rounded-xl text-sm hover:bg-gray-200 transition">
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            ) : (
              <button onClick={handleFollow} className={`px-5 py-2 font-bold rounded-xl text-sm transition ${isFollowing ? 'border border-gray-600 hover:border-white' : 'bg-white text-black hover:bg-gray-200'}`}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Name & Info */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-1">{profile?.name}</h2>
          <p className="text-gray-400 text-sm mb-3">
            <span className="text-white font-semibold">{profile?.role?.toUpperCase()}</span>
            {profile?.sport && <> • {profile.sport}</>}
            {profile?.location && <> • {profile.location}</>}
          </p>
          <p className="text-gray-300 text-sm mb-4 max-w-xl">{profile?.bio || 'No bio yet.'}</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <span><strong className="text-white text-lg">{profile?.followers?.length}</strong> Followers</span>
            <span><strong className="text-white text-lg">{profile?.following?.length}</strong> Following</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8" />

        {/* Edit Form */}
        {editing && (
          <form onSubmit={handleUpdate} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10 flex flex-col gap-4">
            <h3 className="text-lg font-bold mb-2">Edit Profile</h3>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Name" className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition" />
            <input value={formData.sport} onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
              placeholder="Sport" className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition" />
            <input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Location" className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition" />
            <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Bio" rows={3} className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition" />
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Profile Photo</label>
              <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])}
                className="text-sm text-gray-400" />
            </div>
            <button type="submit" className="bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition">Save Changes</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;