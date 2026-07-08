import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function TeacherDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api('/teacher/dashboard').then(setData);
  }, []);

  if (!data) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-body">
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-ink text-white rounded-xl2 p-5">
          <p className="text-xs uppercase opacity-80">Total students</p>
          <p className="font-display font-extrabold text-3xl">{data.totalStudents}</p>
        </div>
        <div className="bg-mint text-white rounded-xl2 p-5">
          <p className="text-xs uppercase opacity-80">Active today</p>
          <p className="font-display font-extrabold text-3xl">{data.dailyActiveCount}</p>
        </div>
      </div>

      {Object.entries(data.classGroups).map(([className, students]) => (
        <div key={className} className="mb-8">
          <h2 className="font-display font-bold text-lg mb-3">{className}</h2>
          <div className="bg-white rounded-xl2 shadow-sm divide-y">
            <div className="grid grid-cols-5 px-5 py-2 text-xs uppercase text-gray-400 font-medium">
              <span>Name</span><span>Level</span><span>Completed</span><span>Avg score</span><span>Active today</span>
            </div>
            {students.map(s => (
              <div key={s.id} className="grid grid-cols-5 px-5 py-3 text-sm items-center">
                <span className="font-medium">{s.name}</span>
                <span>{s.level}</span>
                <span>{s.completed} / {s.total}</span>
                <span>{s.avgScore}%</span>
                <span>{s.activeToday ? '✅' : '—'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
