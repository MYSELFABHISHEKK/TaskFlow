import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="grid min-h-screen bg-mist lg:grid-cols-2">
      <section className="hidden bg-neutral-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="text-xl font-extrabold">TaskFlow</div>
        <div><h1 className="text-5xl font-extrabold tracking-tight">Create a calm place for focused execution.</h1><p className="mt-5 max-w-md text-neutral-300">Projects, ownership, metrics, and work in motion.</p></div>
        <div className="grid grid-cols-3 gap-3">{['Plan', 'Build', 'Ship'].map((item) => <div key={item} className="rounded-xl bg-white/10 p-4 font-semibold">{item}</div>)}</div>
      </section>
      <section className="grid place-items-center p-6">
        <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-neutral-950 shadow-soft">
          <h2 className="text-4xl font-extrabold tracking-tight text-neutral-950">Register</h2>
          <p className="mt-2 text-sm text-neutral-500">Create your first workspace account.</p>
          <div className="mt-8 space-y-4">
            <div><label className="label">Name</label><input className="input mt-1" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="label">Email</label><input className="input mt-1" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="label">Password</label><input className="input mt-1" type="password" minLength="6" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div>
              <label className="label">Account role</label>
              <div className="relative mt-1">
                {form.role === 'admin' ? <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} /> : <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />}
                <select
                  className="input appearance-none pl-10 pr-10"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                {form.role === 'admin' ? 'Admins can create projects, invite members, and manage all tasks.' : 'Members can view assigned projects and update assigned tasks.'}
              </p>
            </div>
          </div>
          <button disabled={submitting} className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Creating account...' : 'Create account'}</button>
          <p className="mt-5 text-center text-sm text-neutral-500">Already have an account? <Link className="font-semibold text-neutral-950" to="/login">Login</Link></p>
        </form>
      </section>
    </main>
  );
}
