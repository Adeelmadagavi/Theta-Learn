import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function TopicList() {
  const { subjectId } = useParams();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    api(`/subjects/${subjectId}/topics`).then(setTopics);
  }, [subjectId]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-body">
      <h1 className="font-display font-bold text-2xl mb-6">Topics</h1>
      <div className="grid gap-4">
        {topics.map(t => (
          <Link
            key={t.id}
            to={`/topics/${t.id}`}
            className="bg-white rounded-xl2 shadow-sm p-5 hover:shadow-md transition-shadow font-display font-bold"
          >
            {t.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
