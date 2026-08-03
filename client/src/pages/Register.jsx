import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'athlete', sport: '', location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(formData);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Panel */}
      <div className="hidden md:flex flex-col justify-center px-16 w-1/2 border-r border-gray-800">
        <h1 className="text-4xl font-extrabold mb-4 tracking-widest">SPORTIN</h1>
        <p className="text-gray-400 text-lg">The professional network built exclusively for athletes, coaches, and sports institutions.</p>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm mb-8">Join the sports professional network</p>

          {error && <p className="text-red-400 text-sm mb-4 bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="name" placeholder="Full Name" onChange={handleChange}
              className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition"
              required
            />
            <input
              name="email" type="email" placeholder="Email Address" onChange={handleChange}
              className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition"
              required
            />
            <input
              name="password" type="password" placeholder="Password" onChange={handleChange}
              className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition"
              required
            />
            <select
              name="role" onChange={handleChange}
              className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition"
            >
              <option value="athlete">Athlete</option>
              <option value="coach">Coach / Institution</option>
            </select>
            <input
              name="sport" placeholder="Your Sport (e.g. Cricket, Football)" onChange={handleChange}
              className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition"
            />
            <input
              name="location" placeholder="Location (e.g. Hyderabad, India)" onChange={handleChange}
              className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition"
            />
            <button
              type="submit" disabled={loading}
              className="bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-white underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;