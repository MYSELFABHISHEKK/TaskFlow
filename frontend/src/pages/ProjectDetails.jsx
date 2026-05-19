import { Plus, Trash2, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { STATUSES } from '../utils/constants';

export default function ProjectDetails() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const { projects, tasks, fetchProjects, fetchTasks, saveTask } = useData();
  const [project, setProject] = useState(null);
  const [taskModal, setTaskModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchTasks({ project: id });
    api.get(`/projects/${id}`).then(({ data }) => setProject(data));
    if (isAdmin) api.get('/users').then(({ data }) => setUsers(data)).catch(() => setUsers([]));
  }, [id, isAdmin]);

  const grouped = useMemo(() => STATUSES.reduce((acc, status) => ({ ...acc, [status]: tasks.filter((task) => task.status === status) }), {}), [tasks]);
  const boardProjects = project ? [project, ...projects.filter((item) => item._id !== project._id)] : projects;
  const availableUsers = useMemo(() => users.filter((user) => !project?.members?.some((member) => member._id === user._id)), [users, project]);

  const addMember = async (event) => {
    event.preventDefault();
    if (!selectedUser) return toast.error('Choose a registered member first');
    try {
      const { data } = await api.post(`/projects/${id}/members`, { userId: selectedUser });
      setProject(data);
      setSelectedUser('');
      await fetchProjects();
      toast.success('Member added to project');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add member');
    }
  };

  const removeMember = async (memberId) => {
    try {
      const { data } = await api.delete(`/projects/${id}/members/${memberId}`);
      setProject(data);
      await fetchProjects();
      await fetchTasks({ project: id });
      toast.success('Member removed from project');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to remove member');
    }
  };

  const updateStatus = async (task, status) => {
    if (task.status !== status) await saveTask({ status }, task._id);
    await fetchTasks({ project: id });
  };

  if (!project) return null;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-3xl font-bold tracking-tight">{project.title}</h1><p className="mt-2 max-w-2xl text-neutral-500 dark:text-neutral-400">{project.description}</p></div>
        {isAdmin && <button className="btn-primary" onClick={() => setTaskModal(true)}><Plus size={18} />New task</button>}
      </div>
      <section className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold">Project members</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.members?.map((member) => (
                <div key={member._id} className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950">
                  <span className="grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white" style={{ background: member.avatarColor }}>{member.name?.[0]}</span>
                  <div className="text-sm">
                    <div className="font-semibold">{member.name}</div>
                    <div className="text-xs text-neutral-500">{member.email}</div>
                  </div>
                  {isAdmin && member._id !== project.admin?._id && member._id !== project.admin && (
                    <button onClick={() => removeMember(member._id)} className="rounded-md p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10" title="Remove member">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {isAdmin && (
            <form onSubmit={addMember} className="flex w-full gap-2 sm:w-auto">
              <select className="input min-w-64" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">Select registered member</option>
                {availableUsers.map((user) => <option key={user._id} value={user._id}>{user.name} - {user.email}</option>)}
              </select>
              <button className="btn-secondary"><UserPlus size={17} />Add</button>
            </form>
          )}
        </div>
      </section>
      <div className="grid gap-4 xl:grid-cols-3">
        {STATUSES.map((status) => (
          <div key={status} onDragOver={(e) => e.preventDefault()} onDrop={(e) => updateStatus(JSON.parse(e.dataTransfer.getData('task')), status)} className="min-h-96 rounded-xl border border-neutral-200 bg-white/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/70">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">{status}</h2><span className="rounded-full bg-neutral-100 px-2 py-1 text-xs dark:bg-neutral-800">{grouped[status]?.length || 0}</span></div>
            <div className="space-y-3">{grouped[status]?.length ? grouped[status].map((task) => <TaskCard key={task._id} task={task} draggable onDragStart={(e) => e.dataTransfer.setData('task', JSON.stringify(task))} />) : <EmptyState title="No tasks" text="Drop tasks here to update status." />}</div>
          </div>
        ))}
      </div>
      {taskModal && <Modal title="New task" onClose={() => setTaskModal(false)}><TaskForm projects={boardProjects} selectedProject={id} onCancel={() => setTaskModal(false)} onSubmit={async (payload) => { await saveTask(payload); await fetchTasks({ project: id }); setTaskModal(false); }} /></Modal>}
    </div>
  );
}
