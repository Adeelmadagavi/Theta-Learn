import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

const RANGES = [
  { key: 'daily', label: 'Today' },
  { key: 'weekly', label: 'This Week' },
  { key: 'overall', label: 'Overall' }
];

export default function Leaderboard() {
  const [range, setRange] = useState('overall');
  const [data, setData] = useState(null);

  useEffect(() => {
    api(`/leaderboard?range=${range}`).then(setData);
  }, [range]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 font-body">
      <h1 className="font-display font-bold text-2xl mb-4">Leaderboard</h1>

      <div className="flex gap-2 mb-6">
        {RANGES.map(r => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`px-4 py-2 rounded-xl2 font-medium text-sm ${range === r.key ? 'bg-ink text-white' : 'bg-white text-gray-500'}`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl2 shadow-sm divide-y">
        {data?.leaderboard.map(row => (
          <div key={row.id} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold w-6 text-gray-400">#{row.rank}</span>
              <span className="font-medium">{row.name}</span>
              <span className="text-xs text-gray-400">Lvl {row.level}</span>
            </div>
            <div className="text-sm font-display font-bold text-sunshine">{row.xp} XP</div>
          </div>
        ))}
        {data?.leaderboard.length === 0 && (
          <p className="px-5 py-6 text-center text-gray-400 text-sm">No activity in this range yet.</p>
        )}
      </div>
    </div>
  );
}
