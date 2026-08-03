import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white tracking-widest">SPORTIN</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm border border-gray-600 rounded-full hover:border-white transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2 text-sm bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Join Now
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-20">
        <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">CONNECTING ATHLETES & COACHES</p>
        <h2 className="text-5xl font-extrabold leading-tight mb-6">
        Where Talent Meets <br /> Opportunity
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          A professional network for the sports community.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-gray-200 transition"
        >
          Get Started
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-16 py-12 border-t border-gray-800">
        {[
          { title: 'Athlete Profiles', desc: 'Showcase your achievements, certificates, and sports journey in one place.' },
          { title: 'Opportunity Hub', desc: 'Discover tournaments, scholarships, training camps and recruitment drives.' },
          { title: 'Sports Networking', desc: 'Connect with athletes, coaches, and institutions across the sports community.' },
        ].map((feature, i) => (
          <div key={i} className="p-8 border border-gray-800 rounded-2xl hover:border-gray-500 transition">
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-800 text-gray-600 text-sm">
        © 2026 Sportin. All rights reserved.
      </div>
    </div>
  );
};

export default Landing;