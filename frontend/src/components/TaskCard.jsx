import { Calendar, GripVertical, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { priorityStyles } from '../utils/constants';

export default function TaskCard({ task, onClick, draggable, onDragStart }) {
  const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';
  return (
    <motion.button
      layout
      whileHover={{ y: -3 }}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition dark:border-neutral-800 dark:bg-neutral-950"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-sm font-semibold leading-5">{task.title}</h4>
        <GripVertical size={16} className="text-neutral-300" />
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">{task.description || 'No description.'}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>{task.priority}</span>
        {task.dueDate && <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${overdue ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'}`}><Calendar size={13} />{new Date(task.dueDate).toLocaleDateString()}</span>}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
        <span className="inline-flex items-center gap-1"><User size={13} />{task.assignedTo?.name}</span>
        <span>{task.project?.title}</span>
      </div>
    </motion.button>
  );
}
