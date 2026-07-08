import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, setPeriod] = useState('overall');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api(`/leaderboard?period=${period}`)
      .then(data => {
        setLeaderboard(data.leaderboard);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [period]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl2 shadow-md p-6 mb-6">
        <h1 className="font-display font-bold text-3xl text-ink mb-4">🏆 Leaderboard</h1>
        
        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {['daily', 'weekly', 'overall'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`
                px-4 py-2 rounded-lg font-body font-medium transition-all
                ${period === p 
                  ? 'bg-coral text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-2 font-display text-sm text-ink">Rank</th>
                  <th className="text-left py-3 px-2 font-display text-sm text-ink">Name</th>
                  <th className="text-left py-3 px-2 font-display text-sm text-ink">Level</th>
                  <th className="text-right py-3 px-2 font-display text-sm text-ink">XP</th>
                  <th className="text-right py-3 px-2 font-display text-sm text-ink">Activities</th>
                  <th className="text-right py-3 px-2 font-display text-sm text-ink">Badges</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map(user => (
                  <tr 
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-display font-bold
                        ${user.rank === 1 ? 'bg-sunshine text-white' : ''}
                        ${user.rank === 2 ? 'bg-gray-300 text-white' : ''}
                        ${user.rank === 3 ? 'bg-amber-600 text-white' : ''}
                        ${user.rank > 3 ? 'bg-gray-100 text-gray-600' : ''}
                      `}>
                        {user.rank}
                      </div>
                    </td>
                    <td className="py-3 px-2 font-body font-medium text-ink">
                      {user.name}
                    </td>
                    <td className="py-3 px-2 font-body text-gray-600">
                      Level {user.level}
                    </td>
                    <td className="py-3 px-2 font-body text-right text-coral font-bold">
                      {user.xp}
                    </td>
                    <td className="py-3 px-2 font-body text-right text-gray-600">
                      {user.completed_activities}
                    </td>
                    <td className="py-3 px-2 font-body text-right">
                      <span className="bg-mint text-white px-2 py-1 rounded-full text-xs font-bold">
                        {user.badges_earned} 🏅
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}