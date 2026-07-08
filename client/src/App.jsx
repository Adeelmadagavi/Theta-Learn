import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { getToken, clearToken } from './lib/api';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TopicList from './pages/TopicList';
import TopicActivities from './pages/TopicActivities';
import ActivityPlayer from './pages/ActivityPlayer';
import Leaderboard from './pages/Leaderboard';
import TeacherDashboard from './pages/TeacherDashboard';

function RequireAuth({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    setUser(null);
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-cloud">
      {getToken() && (
        <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
          <Link to="/dashboard" className="font-display font-extrabold text-ink">Theta Learn</Link>
          <div className="flex gap-4 text-sm font-medium">
            <Link to="/leaderboard" className="text-gray-500 hover:text-ink">Leaderboard</Link>
            <button onClick={handleLogout} className="text-coral">Log out</button>
          </div>
        </nav>
      )}

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
    </div>
  );
}
