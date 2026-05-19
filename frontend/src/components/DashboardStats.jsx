import { AlertTriangle, CheckCircle2, CircleDot, ListTodo } from 'lucide-react';

const iconMap = {
  total: ListTodo,
  completed: CheckCircle2,
  pending: CircleDot,
  overdue: AlertTriangle
};

export default function DashboardStats({ totals }) {
  const items = [
    ['total', 'Total tasks'],
    ['completed', 'Completed'],
    ['pending', 'Pending'],
    ['overdue', 'Overdue']
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(([key, label]) => {
        const Icon = iconMap[key];
        return (
          <div key={key} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-neutral-100 dark:bg-neutral-800"><Icon size={18} /></span>
            </div>
            <div className="mt-4 text-3xl font-bold tracking-tight">{totals?.[key] || 0}</div>
          </div>
        );
      })}
    </div>
  );
}
