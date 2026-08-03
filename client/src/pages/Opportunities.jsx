import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOpportunities, applyToOpportunity } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import OpportunityModal from '../components/OpportunityModal';

const Opportunities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState({});
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const { data } = await getOpportunities();
        setOpportunities(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchOpportunities();
  }, []);

  const handleApply = async (id) => {
    try {
      await applyToOpportunity(id);
      setApplied({ ...applied, [id]: true });
      setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === 'all' ? opportunities : opportunities.filter(o => o.type === filter);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-widest cursor-pointer" onClick={() => navigate('/dashboard')}>SPORTIN</h1>
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 hover:text-white transition">Dashboard</button>
          <button onClick={() => navigate(`/profile/${user?._id}`)} className="text-sm text-gray-400 hover:text-white transition">My Profile</button>
          {user?.role === 'coach' && (
            <button onClick={() => navigate('/post-opportunity')} className="px-4 py-2 bg-white text-black font-bold rounded-full text-sm hover:bg-gray-200 transition">+ Post Opportunity</button>
          )}
        </div>
      </nav>

      <div className="px-10 py-10">
        <h2 className="text-3xl font-bold mb-2">Opportunities</h2>
        <p className="text-gray-400 text-sm mb-8">Discover tournaments, scholarships, training camps and more.</p>

        {/* Filters */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {['all', 'tournament', 'scholarship', 'training', 'recruitment'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm capitalize transition ${filter === type ? 'bg-white text-black font-bold' : 'border border-gray-700 text-gray-400 hover:border-white hover:text-white'}`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No opportunities found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((opp) => (
              <div
                key={opp._id}
                onClick={() => setSelected(opp)}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-500 transition flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs uppercase tracking-widest text-gray-400 bg-gray-800 px-3 py-1 rounded-full">{opp.type}</span>
                    <span className="text-xs text-gray-500">Due: {new Date(opp.deadline).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2">{opp.title}</h4>
                  <p className="text-gray-400 text-sm mb-4">{opp.description.substring(0, 100)}...</p>
                  <p className="text-xs text-gray-500 mb-1">📍 {opp.location}</p>
                  <p className="text-xs text-gray-500 mb-4">🏅 {opp.sport}</p>
                  <p className="text-xs text-gray-600">Posted by: {opp.postedBy?.name}</p>
                </div>
                <div className="mt-4 py-2 rounded-xl text-sm font-bold text-center bg-gray-800 text-gray-400">
                  {user?.role === 'coach' ? 'Click to View Details' : applied[opp._id] || opp.applicants?.includes(user._id) ? 'Applied ✓' : 'Click to View & Apply'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <OpportunityModal
        opportunity={selected}
        onClose={() => setSelected(null)}
        onApply={handleApply}
        applied={selected ? applied[selected._id] || selected.applicants?.includes(user?._id) : false}
      />
    </div>
  );
};

export default Opportunities;