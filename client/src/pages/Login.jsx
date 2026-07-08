import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken, setRole } from '../lib/api';

export default function Login({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', class_name: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const data = await api(path, { method: 'POST', body: form });
      setToken(data.token);
      setRole(data.user.role);
      onAuth(data.user);
      navigate(data.user.role === 'teacher' ? '/teacher' : '/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl2 shadow-md p-8 w-full max-w-sm font-body">
        <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Theta Learn</h1>
        <p className="text-gray-500 text-sm mb-6">Gamified NCERT practice for Maths &amp; Science</p>

        {mode === 'register' && (
          <>
            <input
              className="w-full mb-3 px-4 py-2 rounded-xl2 border-2 border-gray-200 focus:border-sky outline-none"
              placeholder="Full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <select
              className="w-full mb-3 px-4 py-2 rounded-xl2 border-2 border-gray-200"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            {form.role === 'student' && (
              <input
                className="w-full mb-3 px-4 py-2 rounded-xl2 border-2 border-gray-200 focus:border-sky outline-none"
                placeholder="Class (e.g. 9-A)"
                value={form.class_name}
                onChange={e => setForm({ ...form, class_name: e.target.value })}
              />
            )}
          </>
        )}

        <input
          type="email"
          className="w-full mb-3 px-4 py-2 rounded-xl2 border-2 border-gray-200 focus:border-sky outline-none"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          className="w-full mb-4 px-4 py-2 rounded-xl2 border-2 border-gray-200 focus:border-sky outline-none"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />

        {error && <p className="text-coral text-sm mb-3">{error}</p>}

        <button className="w-full py-3 rounded-xl2 font-display font-bold text-white bg-ink mb-3">
          {mode === 'login' ? 'Log in' : 'Create account'}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="w-full text-sm text-sky font-medium"
        >
          {mode === 'login' ? "New here? Create an account" : 'Already have an account? Log in'}
        </button>
      </form>
    </div>
  );
}
