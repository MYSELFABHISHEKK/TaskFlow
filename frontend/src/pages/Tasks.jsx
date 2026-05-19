import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { PRIORITIES, STATUSES } from '../utils/constants';
import FilterDropdown from '../components/FilterDropdown';
import SearchBar from '../components/SearchBar';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import EmptyState from '../components/EmptyState';

export default function Tasks() {
  const { isAdmin } = useAuth();
  const { tasks, projects, fetchTasks, fetchProjects, saveTask, deleteTask } = useData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [modalTask, setModalTask] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchProjects(); fetchTasks(); }, []);
  useEffect(() => { const t = setTimeout(() => fetchTasks({ search, status, priority }), 250); return () => clearTimeout(t); }, [search, status, priority]);
  const visible = useMemo(() => tasks, [tasks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold tracking-tight">Tasks</h1><p className="mt-2 text-neutral-500 dark:text-neutral-400">Search, filter, and keep execution moving.</p></div>
        {isAdmin && <button className="btn-primary" onClick={() => setCreating(true)}><Plus size={18} />New task</button>}
      </div>
      <div className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 md:grid-cols-[1fr_auto_auto]">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks" />
        <FilterDropdown value={status} onChange={setStatus} options={STATUSES} label="All status" />
        <FilterDropdown value={priority} onChange={setPriority} options={PRIORITIES} label="All priority" />
      </div>
      {visible.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((task) => <TaskCard key={task._id} task={task} onClick={() => setModalTask(task)} />)}</div> : <EmptyState title="No tasks found" text="Try another filter or create a new task." />}
      {(creating || modalTask) && <Modal title={modalTask ? 'Task details' : 'New task'} onClose={() => { setCreating(false); setModalTask(null); }}><TaskForm task={modalTask} projects={projects} onCancel={() => { setCreating(false); setModalTask(null); }} onSubmit={async (payload) => { await saveTask(payload, modalTask?._id); setCreating(false); setModalTask(null); }} />{modalTask && isAdmin && <button onClick={async () => { await deleteTask(modalTask._id); setModalTask(null); }} className="mt-4 text-sm font-semibold text-rose-600">Delete task</button>}</Modal>}
    </div>
  );
}
