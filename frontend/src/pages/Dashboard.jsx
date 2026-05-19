import { useEffect } from 'react';
import { useData } from '../context/DataContext';
import DashboardStats from '../components/DashboardStats';
import Charts from '../components/Charts';
import Loader from '../components/Loader';
import TaskCard from '../components/TaskCard';

export default function Dashboard() {
  const { stats, fetchStats } = useData();
  useEffect(() => { fetchStats(); }, []);
  if (!stats) return <Loader />;
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Dashboard</h1><p className="mt-2 text-neutral-500 dark:text-neutral-400">A live read on delivery health and task ownership.</p></div>
      <DashboardStats totals={stats.totals} />
      {stats.assignedTasks?.length > 0 && (
        <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Assigned to you</h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Your current tasks from projects you belong to.</p>
            </div>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold dark:bg-neutral-800">{stats.assignedTasks.length}</span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {stats.assignedTasks.map((task) => <TaskCard key={task._id} task={task} />)}
          </div>
        </section>
      )}
      <Charts byStatus={stats.byStatus} perUser={stats.perUser} />
      <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold">Recent activity</h3>
        <div className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800">
          {stats.recent.map((task) => (
            <div key={task._id} className="flex items-center justify-between py-3">
              <div><div className="text-sm font-semibold">{task.title}</div><div className="text-xs text-neutral-500">{task.project?.title} - {task.assignedTo?.name}</div></div>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium dark:bg-neutral-800">{task.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
