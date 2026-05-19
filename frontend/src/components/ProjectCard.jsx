import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function ProjectCard({ project }) {
  const done = project.progress?.done || 0;
  const total = project.progress?.total || 0;
  const percent = total ? Math.round((done / total) * 100) : 0;
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">{project.description || 'No description yet.'}</p>
        </div>
        <Link to={`/projects/${project._id}`} className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"><ArrowUpRight size={18} /></Link>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-medium text-neutral-500"><span>Progress</span><span>{percent}%</span></div>
        <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800"><div className="h-2 rounded-full bg-teal-500" style={{ width: `${percent}%` }} /></div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members?.slice(0, 5).map((member) => (
            <span key={member._id} className="grid h-8 w-8 place-items-center rounded-full border-2 border-white text-xs font-bold text-white dark:border-neutral-900" style={{ background: member.avatarColor }}>{member.name?.[0]}</span>
          ))}
        </div>
        <span className="text-xs text-neutral-500">{total} tasks</span>
      </div>
    </motion.div>
  );
}
