import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    api('/student/dashboard').then(setData);
    api('/subjects').then(setSubjects);
  }, []);

  if (!data) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const xpIntoLevel = data.user.xp - (data.user.level - 1) * 100;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-body">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Level" value={data.user.level} accent="bg-ink" />
        <StatCard label="XP" value={data.user.xp} accent="bg-sunshine" dark />
        <StatCard label="Coins" value={data.user.coins} accent="bg-sunshine" dark />
        <StatCard label="Streak" value={`${data.streak.current_streak} 🔥`} accent="bg-coral" />
      </div>

      <div className="bg-white rounded-xl2 shadow-sm p-5 mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Level {data.user.level}</span>
          <span>{xpIntoLevel} / 100 XP to next level</span>
        </div>
        <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full bg-mint" style={{ width: `${Math.min(100, xpIntoLevel)}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {subjects.map(s => (
          <Link
            key={s.id}
            to={`/subjects/${s.id}`}
            className="bg-white rounded-xl2 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <h3 className="font-display font-bold text-lg">{s.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {data.subjectProgress.find(p => p.subject === s.name)?.done || 0} / {data.subjectProgress.find(p => p.subject === s.name)?.total || 0} activities done
            </p>
          </Link>
        ))}
      </div>

      {data.recentBadges.length > 0 && (
        <div className="bg-white rounded-xl2 shadow-sm p-5">
          <h3 className="font-display font-bold mb-3">Recent badges</h3>
          <div className="flex gap-3 flex-wrap">
            {data.recentBadges.map(b => (
              <span key={b.id} className="px-3 py-2 rounded-xl2 bg-cloud text-sm font-medium">
                {b.icon} {b.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Link to="/leaderboard" className="text-sky font-medium">View leaderboard →</Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent, dark }) {
  return (
    <div className={`${accent} ${dark ? 'text-ink' : 'text-white'} rounded-xl2 p-4`}>
      <p className="text-xs uppercase tracking-wide opacity-80">{label}</p>
      <p className="font-display font-extrabold text-2xl">{value}</p>
    </div>
  );
}
