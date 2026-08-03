import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOpportunities } from '../utils/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const { data } = await getOpportunities();
        setOpportunities(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchOpportunities();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-2">Log out?</h3>
            <p className="text-gray-400 text-sm mb-6">Are you sure you want to log out of Sportin?</p>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-white text-black font-bold rounded-xl text-sm hover:bg-gray-200 transition"
              >
                Yes, Log out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 border border-gray-600 rounded-xl text-sm hover:border-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-widest cursor-pointer" onClick={() => navigate('/dashboard')}>SPORTIN</h1>
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate('/opportunities')} className="text-sm text-gray-400 hover:text-white transition">Opportunities</button>
          <button onClick={() => navigate('/explore')} className="text-sm text-gray-400 hover:text-white transition">Explore</button>
          <button onClick={() => navigate(`/profile/${user?._id}`)} className="text-sm text-gray-400 hover:text-white transition">My Profile</button>
          {user?.role === 'coach' && (
            <button onClick={() => navigate('/post-opportunity')} className="text-sm text-gray-400 hover:text-white transition">Post Opportunity</button>
          )}
          <button onClick={() => setShowLogoutModal(true)} className="px-4 py-2 text-sm border border-gray-600 rounded-full hover:border-white transition">Logout</button>
        </div>
      </nav>

      {/* Main */}
      <div className="px-10 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-1">
           {new Date().getHours() < 12 ? 'Good Morning, ' : new Date().getHours() < 16 ? 'Good Afternoon, ' : 'Good Evening, '}{user?.name}
          </h2>
          <p className="text-gray-400 text-sm">{user?.role === 'coach' ? 'Manage your opportunities and connect with athletes.' : 'Discover opportunities and grow your sports career.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Role', value: user?.role?.toUpperCase() },
            { label: 'Sport', value: user?.sport || 'Not set' },
            { label: 'Location', value: user?.location || 'Not set' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Recent Opportunities</h3>
            <button onClick={() => navigate('/opportunities')} className="text-sm text-gray-400 hover:text-white transition">View All →</button>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : opportunities.length === 0 ? (
            <p className="text-gray-400">No opportunities yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <div key={opp._id} onClick={() => navigate('/opportunities')} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-500 transition cursor-pointer">
                  <span className="text-xs uppercase tracking-widest text-gray-400 bg-gray-800 px-3 py-1 rounded-full">{opp.type}</span>
                  <h4 className="text-lg font-bold mt-3 mb-2">{opp.title}</h4>
                  <p className="text-gray-400 text-sm mb-3">{opp.description.substring(0, 80)}...</p>
                  <p className="text-xs text-gray-500">📍 {opp.location} • 🏅 {opp.sport}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 flex gap-4">
          <button onClick={() => navigate(`/profile/${user?._id}`)} className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition text-sm">
            View My Profile
          </button>
          <button onClick={() => navigate('/opportunities')} className="px-6 py-3 border border-gray-600 rounded-xl hover:border-white transition text-sm">
            Browse Opportunities
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;