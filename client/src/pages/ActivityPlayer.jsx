import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import QuizEngine from '../components/engines/QuizEngine';
import MatchEngine from '../components/engines/MatchEngine';
import DragDropEngine from '../components/engines/DragDropEngine';
import SequenceEngine from '../components/engines/SequenceEngine';
import MemoryEngine from '../components/engines/MemoryEngine';

// Single source of truth mapping activity.type -> engine component.
// Adding a new activity type later is a one-line change here.
const ENGINES = {
  quiz: QuizEngine,
  match: MatchEngine,
  dragdrop: DragDropEngine,
  sequence: SequenceEngine,
  memory: MemoryEngine
};

export default function ActivityPlayer() {
  const { activityId, topicId } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api(`/topics/${topicId}/activities`).then(({ activities }) => {
      setActivity(activities.find(a => String(a.id) === activityId));
    });
  }, [activityId, topicId]);

  async function handleComplete(outcome) {
    const res = await api(`/activities/${activityId}/attempt`, { method: 'POST', body: outcome });
    setResult({ ...outcome, ...res });
  }

  if (!activity) return <div className="text-center py-20 text-gray-400">Loading activity...</div>;

  const Engine = ENGINES[activity.type];

  if (result) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-xl2 shadow-md p-8 text-center font-body">
        <p className="text-4xl mb-2">{result.correct ? '🎉' : '💪'}</p>
        <h2 className="font-display font-bold text-xl mb-1">
          +{result.xpAwarded} XP &nbsp;·&nbsp; +{result.coinsAwarded} coins
        </h2>
        {result.leveledUp && (
          <p className="text-sunshine font-display font-bold mt-2">Level up! You're now level {result.newLevel} 🚀</p>
        )}
        {result.newBadges?.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            New badge{result.newBadges.length > 1 ? 's' : ''}: {result.newBadges.map(b => `${b.icon} ${b.name}`).join(', ')}
          </p>
        )}
        <button
          onClick={() => navigate(`/topics/${topicId}`)}
          className="mt-6 py-3 px-6 rounded-xl2 font-display font-bold text-white bg-ink"
        >
          Back to topic
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Engine content={activity.content} onComplete={handleComplete} />
    </div>
  );
}
