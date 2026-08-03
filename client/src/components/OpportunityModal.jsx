import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const OpportunityModal = ({ opportunity, onClose, onApply, applied }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!opportunity) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>

        <span className="text-xs uppercase tracking-widest text-gray-400 bg-gray-800 px-3 py-1 rounded-full">{opportunity.type}</span>
        <h2 className="text-2xl font-bold mt-4 mb-2">{opportunity.title}</h2>
        <p className="text-gray-300 text-sm mb-6">{opportunity.description}</p>

        <div className="flex flex-col gap-2 mb-6 text-sm text-gray-400">
          <p>📍 <span className="text-white">{opportunity.location}</span></p>
          <p>🏅 <span className="text-white">{opportunity.sport}</span></p>
          <p>📅 Deadline: <span className="text-white">{new Date(opportunity.deadline).toLocaleDateString()}</span></p>
          <p>👤 Posted by: <span className="text-white">{opportunity.postedBy?.name}</span></p>
          <p>👥 Applicants: <span className="text-white">{opportunity.applicants?.length}</span></p>
        </div>

        {user?.role === 'athlete' && (
          <button
            onClick={() => onApply(opportunity._id)}
            disabled={applied}
            className={`w-full py-3 rounded-xl font-bold text-sm transition ${applied ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'}`}
          >
            {applied ? 'Applied ✓' : 'Apply Now'}
          </button>
        )}

        {user?.role === 'coach' && (
        <button
         onClick={() => { onClose(); navigate(`/applicants/${opportunity._id}`); }}
         className="w-full py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-200 transition"
        >
          View Applicants ({opportunity.applicants?.length})
        </button>
        )}
      </div>
    </div>
  );
};

export default OpportunityModal;