import { Plus, Trash2, UserPlus, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

const initialForm = { name: '', email: '', password: '', role: 'member' };

export default function Members() {
  const { user, isAdmin } = useAuth();
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const totals = useMemo(() => ({
    members: members.filter((member) => member.role === 'member').length,
    admins: members.filter((member) => member.role === 'admin').length,
    tasks: members.reduce((sum, member) => sum + (member.stats?.totalTasks || 0), 0)
  }), [members]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setMembers(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchMembers();
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post('/users', form);
      setMembers((current) => [data, ...current]);
      setForm(initialForm);
      setOpen(false);
      toast.success('Member added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add member');
    }
  };

  const remove = async (member) => {
    try {
      await api.delete(`/users/${member._id}`);
      setMembers((current) => current.filter((item) => item._id !== member._id));
      toast.success(`${member.name} removed`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to remove member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">Track team access, workload, and task ownership.</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen(true)}><UserPlus size={18} />Add member</button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-sm text-neutral-500"><span>Members</span><UsersRound size={18} /></div>
          <div className="mt-3 text-3xl font-bold">{totals.members}</div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-sm text-neutral-500"><span>Admins</span><UsersRound size={18} /></div>
          <div className="mt-3 text-3xl font-bold">{totals.admins}</div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-sm text-neutral-500"><span>Assigned tasks</span><UsersRound size={18} /></div>
          <div className="mt-3 text-3xl font-bold">{totals.tasks}</div>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />)}
          </div>
        ) : members.length ? (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {members.map((member) => (
              <div key={member._id} className="grid gap-4 p-5 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white" style={{ background: member.avatarColor }}>{member.name?.[0]}</span>
                  <div>
                    <div className="font-semibold">{member.name}</div>
                    <div className="text-sm text-neutral-500">{member.email}</div>
                  </div>
                </div>
                <div>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold capitalize dark:bg-neutral-800">{member.role}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs text-neutral-500">
                  <div><div className="text-base font-bold text-neutral-950 dark:text-white">{member.stats?.projectCount || 0}</div>Projects</div>
                  <div><div className="text-base font-bold text-neutral-950 dark:text-white">{member.stats?.totalTasks || 0}</div>Tasks</div>
                  <div><div className="text-base font-bold text-neutral-950 dark:text-white">{member.stats?.completedTasks || 0}</div>Done</div>
                </div>
                <button disabled={member._id === user.id || member._id === user._id} onClick={() => remove(member)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-800 dark:hover:bg-rose-500/10">
                  <Trash2 size={16} />Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5"><EmptyState title="No members found" text="Add the first teammate to start tracking work." /></div>
        )}
      </section>

      {open && (
        <Modal title="Add member" onClose={() => setOpen(false)}>
          <form className="space-y-4" onSubmit={submit}>
            <div><label className="label">Name</label><input className="input mt-1" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="label">Email</label><input className="input mt-1" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="label">Temporary password</label><input className="input mt-1" type="password" minLength="6" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div><label className="label">Role</label><select className="input mt-1" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="member">Member</option><option value="admin">Admin</option></select></div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-primary"><Plus size={18} />Add member</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
