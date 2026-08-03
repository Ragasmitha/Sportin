import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOpportunity } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PostOpportunity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', sport: '', location: '', deadline: '', type: 'tournament'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createOpportunity(formData);
      navigate('/opportunities');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  if (user?.role !== 'coach') {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-widest cursor-pointer" onClick={() => navigate('/dashboard')}>SPORTIN</h1>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 hover:text-white transition">← Dashboard</button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-2">Post Opportunity</h2>
        <p className="text-gray-400 text-sm mb-8">Fill in the details to connect with athletes.</p>

        {error && <p className="text-red-400 text-sm mb-4 bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="title" placeholder="Opportunity Title" onChange={handleChange}
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition"
            required
          />
          <textarea
            name="description" placeholder="Description" rows={4} onChange={handleChange}
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition"
            required
          />
          <select
            name="type" onChange={handleChange}
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition"
          >
            <option value="tournament">Tournament</option>
            <option value="scholarship">Scholarship</option>
            <option value="training">Training Camp</option>
            <option value="recruitment">Recruitment</option>
          </select>
          <input
            name="sport" placeholder="Sport (e.g. Cricket, Football)" onChange={handleChange}
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition"
            required
          />
          <input
            name="location" placeholder="Location" onChange={handleChange}
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition"
            required
          />
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Application Deadline</label>
            <input
              name="deadline" type="date" onChange={handleChange}
              className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition w-full"
              required
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition mt-2"
          >
            {loading ? 'Posting...' : 'Post Opportunity'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostOpportunity;