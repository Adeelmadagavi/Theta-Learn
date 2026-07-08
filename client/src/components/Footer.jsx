import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="font-display font-bold text-2xl mb-2 text-sunshine">
              Theta Learn
            </h3>
            <p className="font-body text-sm text-white opacity-70">
              Making NCERT learning fun through gamification 🎮
            </p>
            <div className="mt-4">
              <a 
                href="https://github.com/Adeelmadagavi/Theta-Learn" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm hover:text-sunshine transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-sm mb-3 text-sky">Quick Links</h4>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-sunshine transition-colors">
                  📊 Dashboard
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-sunshine transition-colors">
                  🏆 Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="font-display font-bold text-sm mb-3 text-mint">Subjects</h4>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <Link to="/subjects/1" className="hover:text-sunshine transition-colors">
                  ➕ Mathematics
                </Link>
              </li>
              <li>
                <Link to="/subjects/2" className="hover:text-sunshine transition-colors">
                  🔬 Science
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display font-bold text-sm mb-3 text-coral">About</h4>
            <p className="font-body text-sm text-white opacity-70">
              A gamified learning platform for NCERT students. Built with React, Tailwind CSS, and SQLite.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-white bg-opacity-10 rounded-full">
                ⚛️ React
              </span>
              <span className="text-xs px-2 py-1 bg-white bg-opacity-10 rounded-full">
                🎨 Tailwind
              </span>
              <span className="text-xs px-2 py-1 bg-white bg-opacity-10 rounded-full">
                🗄️ SQLite
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white border-opacity-20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <p className="font-body text-sm text-white opacity-60 text-center md:text-left">
              © {currentYear} Theta Learn. Built for{' '}
              <a 
                href="https://thetadynamics.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sunshine hover:underline"
              >
                Theta Dynamics Hackathon
              </a>
            </p>

            {/* Tags */}
            <div className="flex gap-2 items-center">
              <span className="font-body text-xs px-3 py-1 bg-white bg-opacity-10 rounded-full">
                🎮 Gamified Learning
              </span>
              <span className="font-body text-xs px-3 py-1 bg-white bg-opacity-10 rounded-full">
                📚 NCERT Based
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}