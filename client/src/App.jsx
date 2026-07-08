import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { getToken, clearToken } from './lib/api';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TopicList from './pages/TopicList';
import TopicActivities from './pages/TopicActivities';
import ActivityPlayer from './pages/ActivityPlayer';
import Leaderboard from './pages/Leaderboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Footer from './components/Footer';

function RequireAuth({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    clearToken();
    setUser(null);
    navigate('/login');
  }

  // Hide footer on login page
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-cloud flex flex-col">
      {getToken() && (
        <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
          <Link to="/dashboard" className="font-display font-extrabold text-2xl text-ink hover:text-sky transition-colors">
            Theta Learn
          </Link>
          <div className="flex gap-4 text-sm font-medium font-body">
            <Link 
              to="/dashboard" 
              className="text-gray-500 hover:text-ink transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/leaderboard" 
              className="text-gray-500 hover:text-ink transition-colors"
            >
              Leaderboard
            </Link>
            <button 
              onClick={handleLogout} 
              className="text-coral hover:text-red-600 transition-colors"
            >
              Log out
            </button>
          </div>
        </nav>
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login onAuth={setUser} />} />
          <Route path="/dashboard" element={<RequireAuth><StudentDashboard /></RequireAuth>} />
          <Route path="/subjects/:subjectId" element={<RequireAuth><TopicList /></RequireAuth>} />
          <Route path="/topics/:topicId" element={<RequireAuth><TopicActivities /></RequireAuth>} />
          <Route path="/topics/:topicId/activities/:activityId" element={<RequireAuth><ActivityPlayer /></RequireAuth>} />
          <Route path="/leaderboard" element={<RequireAuth><Leaderboard /></RequireAuth>} />
          <Route path="/teacher" element={<RequireAuth><TeacherDashboard /></RequireAuth>} />
          <Route path="*" element={<Navigate to={getToken() ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </main>

      {!isLoginPage && <Footer />}
    </div>
  );
}