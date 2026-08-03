import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicants } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Applicants = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'coach') navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const { data } = await getApplicants(id);
        setApplicants(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchApplicants();
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-widest cursor-pointer" onClick={() => navigate('/dashboard')}>SPORTIN</h1>
        <button onClick={() => navigate('/opportunities')} className="text-sm text-gray-400 hover:text-white transition">← Opportunities</button>
      </nav>

      <div className="px-10 py-10">
        <h2 className="text-3xl font-bold mb-2">Applicants</h2>
        <p className="text-gray-400 text-sm mb-8">Athletes who applied for this opportunity.</p>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : applicants.length === 0 ? (
          <p className="text-gray-400">No applicants yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applicants.map((app) => (
              <div
                key={app._id}
                onClick={() => navigate(`/profile/${app.applicant._id}`)}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-500 transition cursor-pointer flex items-center gap-4"
              >
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex-shrink-0">
                  {app.applicant.profilePhoto ? (
                    <img src={app.applicant.profilePhoto} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                      {app.applicant.name?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <h4 className="font-bold text-white">{app.applicant.name}</h4>
                  <p className="text-gray-400 text-xs mt-1">{app.applicant.sport} • {app.applicant.location}</p>
                  <p className="text-gray-500 text-xs mt-1">{app.applicant.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;