import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import DailyChallenge from '../components/DailyChallenge';

export default function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsData, subjectsData, leaderboardData] = await Promise.all([
          api('/user/stats'),
          api('/subjects'),
          api('/leaderboard')
        ]);

        setStats(statsData);

        // Backend returns an array, not { subjects: [...] }
        setSubjects(Array.isArray(subjectsData) ? subjectsData : (subjectsData?.subjects || []));

        // Read the correct token key
        const token = localStorage.getItem('theta_token');

        if (token && leaderboardData?.leaderboard) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userEntry = leaderboardData.leaderboard.find(
            user => user.id === payload.id
          );

          setMyRank(userEntry?.rank || null);
        }
      } catch (err) {
        console.error('Dashboard Error:', err);
        setSubjects([]);
      }
    }

    loadDashboard();
  }, []);

  if (!stats) {
    return (
      <div className="p-8 text-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">

      <div className="mb-6">
        <DailyChallenge />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white rounded-xl2 shadow-md p-6 text-center">
          <div className="text-3xl mb-2">⭐</div>
          <div className="font-display font-bold text-2xl text-ink">
            {stats.level}
          </div>
          <div className="font-body text-sm text-gray-500">
            Level
          </div>
        </div>

        <div className="bg-white rounded-xl2 shadow-md p-6 text-center">
          <div className="text-3xl mb-2">💎</div>
          <div className="font-display font-bold text-2xl text-coral">
            {stats.xp}
          </div>
          <div className="font-body text-sm text-gray-500">
            XP
          </div>
        </div>

        <div className="bg-white rounded-xl2 shadow-md p-6 text-center">
          <div className="text-3xl mb-2">🪙</div>
          <div className="font-display font-bold text-2xl text-sunshine">
            {stats.coins}
          </div>
          <div className="font-body text-sm text-gray-500">
            Coins
          </div>
        </div>

        <div className="bg-white rounded-xl2 shadow-md p-6 text-center">
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-display font-bold text-2xl text-mint">
            {myRank ? `#${myRank}` : '--'}
          </div>
          <div className="font-body text-sm text-gray-500">
            Rank
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white rounded-xl2 shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-sm text-gray-500">
              Streak
            </span>
            <span className="text-2xl">🔥</span>
          </div>

          <div className="font-display font-bold text-xl text-ink">
            {stats.currentStreak || 0} days
          </div>
        </div>

        <div className="bg-white rounded-xl2 shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-sm text-gray-500">
              Completed
            </span>
            <span className="text-2xl">✓</span>
          </div>

          <div className="font-display font-bold text-xl text-ink">
            {stats.completedActivities || 0} / 30
          </div>
        </div>

        <div className="bg-white rounded-xl2 shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-sm text-gray-500">
              Badges
            </span>
            <span className="text-2xl">🏅</span>
          </div>

          <div className="font-display font-bold text-xl text-ink">
            {stats.badgesEarned || 0}
          </div>
        </div>

      </div>

      <div>
        <h2 className="font-display font-bold text-2xl text-ink mb-4">
          Subjects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {(subjects || []).map(subject => (
            <Link
              key={subject.id}
              to={`/subjects/${subject.id}`}
              className="bg-white rounded-xl2 shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">

                <div className="text-4xl">
                  {subject.name === 'Mathematics' ? '➕' : '🔬'}
                </div>

                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg text-ink mb-1">
                    {subject.name}
                  </h3>

                  <div className="font-body text-sm text-gray-500">
                    {subject.topicCount || 5} Topics
                  </div>
                </div>

                <div className="text-sky">→</div>

              </div>
            </Link>
          ))}

        </div>
      </div>

    </div>
  );
}