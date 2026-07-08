import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';

const TYPE_LABEL = {
  quiz: 'Quiz',
  match: 'Match the following',
  dragdrop: 'Drag and drop',
  sequence: 'Put in order',
  memory: 'Memory game'
};

export default function TopicActivities() {
  const { topicId } = useParams();
  const [activities, setActivities] = useState([]);
  const [difficultyHint, setDifficultyHint] = useState(null);

  useEffect(() => {
    api(`/topics/${topicId}/activities`).then(d => {
      setActivities(d.activities);
      setDifficultyHint(d.difficultyHint);
    });
  }, [topicId]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-body">
      <h1 className="font-display font-bold text-2xl mb-2">Activities</h1>
      {difficultyHint && difficultyHint !== 'same' && (
        <p className="text-sm text-gray-500 mb-4">
          {difficultyHint === 'increase'
            ? "You're doing great here -- try the harder ones next! 💪"
            : 'Take your time -- these get easier as you warm up. 🌱'}
        </p>
      )}
      <div className="grid gap-4">
        {activities.map(a => (
          <Link
            key={a.id}
            to={`/topics/${topicId}/activities/${a.id}`}
            className={`bg-white rounded-xl2 shadow-sm p-5 flex justify-between items-center hover:shadow-md transition-shadow ${a.completed ? 'opacity-60' : ''}`}
          >
            <div>
              <p className="font-display font-bold">{a.title}</p>
              <p className="text-xs text-gray-500">{TYPE_LABEL[a.type]} · Difficulty {a.difficulty}</p>
            </div>
            <span className="text-sm font-medium">
              {a.completed ? '✅ Done' : `+${a.base_xp} XP`}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
