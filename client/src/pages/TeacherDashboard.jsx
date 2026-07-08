import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function TeacherDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api('/teacher/stats').then(setStats);
  }, []);

  if (!stats) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="font-display font-bold text-3xl text-ink mb-6">Teacher Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl2 shadow-md p-6 text-center">
          <div className="text-3xl mb-2">👥</div>
          <div className="font-display font-bold text-2xl text-ink">{stats.totalStudents}</div>
          <div className="font-body text-sm text-gray-500">Total Students</div>
        </div>

        <div className="bg-white rounded-xl2 shadow-md p-6 text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="font-display font-bold text-2xl text-coral">
            {Math.round(stats.avgScore * 100)}%
          </div>
          <div className="font-body text-sm text-gray-500">Avg Score</div>
        </div>

        <div className="bg-white rounded-xl2 shadow-md p-6 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="font-display font-bold text-2xl text-mint">
            {stats.dailyParticipation}
          </div>
          <div className="font-body text-sm text-gray-500">Active Today</div>
        </div>

        <div className="bg-white rounded-xl2 shadow-md p-6 text-center">
          <div className="text-3xl mb-2">📚</div>
          <div className="font-display font-bold text-2xl text-sky">30</div>
          <div className="font-body text-sm text-gray-500">Total Activities</div>
        </div>
      </div>

      {/* Topic Completion */}
      <div className="bg-white rounded-xl2 shadow-md p-6 mb-8">
        <h2 className="font-display font-bold text-xl text-ink mb-4">Topic Completion Status</h2>
        <div className="space-y-3">
          {stats.topicCompletion.map(topic => {
            const completion = (topic.completed_count / topic.total_activities) * 100 || 0;
            return (
              <div key={topic.id}>
                <div className="flex justify-between mb-1">
                  <span className="font-body text-sm text-ink">
                    {topic.subject_name} - {topic.name}
                  </span>
                  <span className="font-body text-sm text-gray-500">
                    {Math.round(completion)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-mint transition-all"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl2 shadow-md p-6">
        <h2 className="font-display font-bold text-xl text-ink mb-4">Student Progress</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-2 font-display text-sm">Name</th>
                <th className="text-left py-3 px-2 font-display text-sm">Class</th>
                <th className="text-right py-3 px-2 font-display text-sm">Level</th>
                <th className="text-right py-3 px-2 font-display text-sm">XP</th>
                <th className="text-right py-3 px-2 font-display text-sm">Activities</th>
                <th className="text-right py-3 px-2 font-display text-sm">Avg Score</th>
                <th className="text-right py-3 px-2 font-display text-sm">Badges</th>
              </tr>
            </thead>
            <tbody>
              {stats.students.map(student => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-body">{student.name}</td>
                  <td className="py-3 px-2 font-body text-gray-600">{student.class_name || '--'}</td>
                  <td className="py-3 px-2 font-body text-right">{student.level}</td>
                  <td className="py-3 px-2 font-body text-right text-coral">{student.xp}</td>
                  <td className="py-3 px-2 font-body text-right">{student.completed_activities}/30</td>
                  <td className="py-3 px-2 font-body text-right">
                    {Math.round((student.avg_score || 0) * 100)}%
                  </td>
                  <td className="py-3 px-2 font-body text-right">{student.badges_earned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}