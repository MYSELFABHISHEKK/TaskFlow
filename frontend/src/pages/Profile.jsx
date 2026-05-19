import { Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="max-w-3xl space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Profile</h1><p className="mt-2 text-neutral-500 dark:text-neutral-400">Your workspace identity and permissions.</p></div>
      <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl text-2xl font-bold text-white" style={{ background: user.avatarColor }}>{user.name?.[0]}</span>
          <div><h2 className="text-xl font-bold">{user.name}</h2><p className="text-sm capitalize text-neutral-500">{user.role}</p></div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"><Mail size={18} /><div className="mt-2 text-sm font-semibold">{user.email}</div></div>
          <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"><Shield size={18} /><div className="mt-2 text-sm font-semibold capitalize">{user.role} access</div></div>
        </div>
      </section>
    </div>
  );
}
