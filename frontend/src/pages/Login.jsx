import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const loginProfiles = [
  {
    role: 'admin',
    title: 'Admin Login',
    email: 'admin@taskflow.dev',
    password: 'password123',
    description: 'Manage projects, members, and all team tasks.',
    icon: ShieldCheck
  },
  {
    role: 'member',
    title: 'Member Login',
    email: 'member@taskflow.dev',
    password: 'password123',
    description: 'View assigned projects and update your tasks.',
    icon: UserRound
  }
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@taskflow.dev', password: 'password123' });
  const [selectedRole, setSelectedRole] = useState('admin');
  const [submitting, setSubmitting] = useState(false);

  const chooseProfile = (profile) => {
    setSelectedRole(profile.role);
    setForm({ email: profile.email, password: profile.password });
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="grid min-h-screen bg-mist lg:grid-cols-2">
      <section className="hidden bg-neutral-950 p-10 text-white lg:flex lg:flex-col">
        <div className="text-xl font-extrabold">TaskFlow</div>
        <div className="my-auto"><h1 className="text-5xl font-extrabold tracking-tight">Welcome back to your operating layer.</h1><p className="mt-5 max-w-md text-neutral-300">Prioritize projects, resolve blockers, and keep execution crisp.</p></div>
      </section>
      <section className="grid place-items-center p-6">
        <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-neutral-950 shadow-soft">
          <h2 className="text-4xl font-extrabold tracking-tight text-neutral-950">Login</h2>
          <p className="mt-2 text-sm text-neutral-500">Use your workspace credentials.</p>
          <div className="mt-8 space-y-4">
            <div><label className="label">Email</label><input className="input mt-1" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="label">Password</label><input className="input mt-1" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          </div>
          <button disabled={submitting} className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Logging in...' : 'Login'}</button>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {loginProfiles.map((profile) => {
              const Icon = profile.icon;
              const active = selectedRole === profile.role;
              return (
                <button
                  key={profile.role}
                  type="button"
                  onClick={() => chooseProfile(profile)}
                  className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${active ? 'border-neutral-950 bg-neutral-950 text-white shadow-soft' : 'border-neutral-200 bg-white text-neutral-950 hover:border-neutral-300 hover:bg-neutral-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`grid h-9 w-9 place-items-center rounded-lg ${active ? 'bg-white/10 text-white' : 'bg-neutral-100 text-neutral-700'}`}>
                      <Icon size={18} />
                    </span>
                    <span className="font-bold">{profile.title}</span>
                  </div>
                  <p className={`mt-3 text-xs leading-5 ${active ? 'text-neutral-300' : 'text-neutral-500'}`}>{profile.description}</p>
                </button>
              );
            })}
          </div>
          <p className="mt-5 text-center text-sm text-neutral-500">New here? <Link className="font-semibold text-neutral-950" to="/register">Create an account</Link></p>
        </form>
      </section>
    </main>
  );
}
