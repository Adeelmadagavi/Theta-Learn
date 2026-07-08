import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function DailyChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api('/daily-challenge')
      .then(data => {
        setChallenge(data.challenge);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl2 shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="bg-gradient-to-r from-sunshine to-coral rounded-xl2 shadow-lg p-6 text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎯</span>
            <h3 className="font-display font-bold text-xl">Daily Challenge</h3>
          </div>
          <p className="text-sm opacity-90">Complete for bonus rewards!</p>
        </div>
        {challenge.completed && (
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-bold">
            ✓ Completed
          </span>
        )}
      </div>

      <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
        <div className="text-xs opacity-75 mb-1">
          {challenge.subject_name} → {challenge.topic_name}
        </div>
        <div className="font-display font-bold text-lg mb-1">
          {challenge.title}
        </div>
        <div className="text-sm opacity-90">
          Type: {challenge.type}
        </div>
      </div>

      {!challenge.completed && (
        <button
          onClick={() => navigate(`/topics/${challenge.topic_id || 1}/activities/${challenge.id}`)}
          className="w-full bg-white text-coral font-display font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all"
        >
          Start Challenge
        </button>
      )}

      {challenge.completed && (
        <div className="text-center text-sm opacity-90">
          Come back tomorrow for a new challenge! 🌟
        </div>
      )}
    </div>
  );
}