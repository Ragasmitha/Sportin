import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { followUser, unfollowUser } from '../utils/api';
import axios from 'axios';

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [following, setFollowing] = useState({});

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('sportinUser'))?.token;
        const { data } = await axios.get('http://localhost:5000/api/users/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const others = data.filter(u => u._id !== user._id);
        setUsers(others);
        const currentUser = data.find(u => u._id === user._id);
        if (currentUser) {
        const followingMap = {};
        currentUser.following.forEach(id => {
           followingMap[id] = true;
        });
        setFollowing(followingMap);
      }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchUsers();
  }, [user]);

  const handleFollow = async (id) => {
    try {
      if (following[id]) {
        await unfollowUser(id);
        setFollowing({ ...following, [id]: false });
      } else {
        await followUser(id);
        setFollowing({ ...following, [id]: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.sport?.toLowerCase().includes(search.toLowerCase()) ||
      u.location?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.role === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-widest cursor-pointer" onClick={() => navigate('/dashboard')}>SPORTIN</h1>
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 hover:text-white transition">Dashboard</button>
          <button onClick={() => navigate('/opportunities')} className="text-sm text-gray-400 hover:text-white transition">Opportunities</button>
          <button onClick={() => navigate(`/profile/${user?._id}`)} className="text-sm text-gray-400 hover:text-white transition">My Profile</button>
        </div>
      </nav>

      <div className="px-10 py-10">
        <h2 className="text-3xl font-bold mb-2">Explore</h2>
        <p className="text-gray-400 text-sm mb-8">Discover athletes, coaches and institutions.</p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, sport, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition mb-6"
        />

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          {['all', 'athlete', 'coach'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm capitalize transition ${filter === type ? 'bg-white text-black font-bold' : 'border border-gray-700 text-gray-400 hover:border-white hover:text-white'}`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Users Grid */}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((u) => (
              <div key={u._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-500 transition flex items-center gap-4">
                {/* Avatar */}
                <div
                  onClick={() => navigate(`/profile/${u._id}`)}
                  className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex-shrink-0 cursor-pointer"
                >
                  {u.profilePhoto ? (
                    <img src={u.profilePhoto} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                      {u.name?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h4
                    onClick={() => navigate(`/profile/${u._id}`)}
                    className="font-bold text-white cursor-pointer hover:underline"
                  >
                    {u.name}
                  </h4>
                  <p className="text-gray-400 text-xs mt-1 capitalize">{u.role} • {u.sport} • {u.location}</p>
                  <button
                    onClick={() => handleFollow(u._id)}
                    className={`mt-3 px-4 py-1 rounded-full text-xs font-bold transition ${following[u._id] ? 'border border-gray-600 text-gray-400 hover:border-white hover:text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                  >
                    {following[u._id] ? 'Unfollow' : 'Follow'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;