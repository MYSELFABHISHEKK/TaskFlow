import { ArrowRight, CheckCircle2, KanbanSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const boardColumns = [
  {
    status: 'To Do',
    count: 1,
    label: 'Backlog',
    column: 'bg-slate-500/10 ring-1 ring-slate-400/20',
    heading: 'text-slate-100',
    accent: 'bg-slate-400',
    card: 'bg-slate-50',
    line: 'bg-slate-300',
    softLine: 'bg-slate-200'
  },
  {
    status: 'In Progress',
    count: 2,
    label: 'Building',
    column: 'bg-sky-500/10 ring-1 ring-sky-400/20',
    heading: 'text-sky-100',
    accent: 'bg-sky-400',
    card: 'bg-sky-50',
    line: 'bg-sky-300',
    softLine: 'bg-sky-200'
  },
  {
    status: 'Done',
    count: 3,
    label: 'Shipped',
    column: 'bg-emerald-500/10 ring-1 ring-emerald-400/20',
    heading: 'text-emerald-100',
    accent: 'bg-emerald-400',
    card: 'bg-emerald-50',
    line: 'bg-emerald-300',
    softLine: 'bg-emerald-200'
  }
];

export default function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-mist text-neutral-950">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-xl font-extrabold">TaskFlow</div>
        <div className="flex gap-2"><Link className="btn-secondary" to="/login">Login</Link><Link className="btn-primary" to="/register">Start</Link></div>
      </nav>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm font-medium text-neutral-600 shadow-sm"><KanbanSquare size={15} />Modern work orchestration</div>
          <h1 className="mt-6 max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl">TaskFlow</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-600">A polished team task management app for projects, kanban execution, analytics, permissions, and calm daily planning.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link className="btn-primary" to="/register">Create workspace <ArrowRight size={18} /></Link><Link className="btn-secondary" to="/login">View demo</Link></div>
          <div className="mt-8 grid gap-3 text-sm text-neutral-600 sm:grid-cols-3">{['JWT auth', 'Role permissions', 'Live dashboard'].map((item) => <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-teal-600" />{item}</span>)}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-white bg-white/70 p-4 shadow-soft backdrop-blur-xl">
          <div className="rounded-xl border border-neutral-200 bg-neutral-950 p-4 text-white">
            <div className="mb-4 flex items-center justify-between"><span className="font-semibold">Launch board</span><span className="rounded-full bg-teal-400/20 px-3 py-1 text-xs text-teal-200">72% done</span></div>
            <div className="grid gap-3 sm:grid-cols-3">
              {boardColumns.map((column) => (
                <div key={column.status} className={`rounded-xl p-3 ${column.column}`}>
                  <div className={`mb-3 flex items-center justify-between text-sm font-semibold ${column.heading}`}>
                    <span className="inline-flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${column.accent}`} />{column.status}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/70">{column.label}</span>
                  </div>
                  {Array.from({ length: column.count }).map((_, card) => (
                    <div key={card} className={`mb-3 rounded-lg ${column.card} p-3 text-sm text-neutral-900 shadow`}>
                      <div className={`h-2 w-2/3 rounded ${column.line}`} />
                      <div className={`mt-3 h-2 w-full rounded ${column.softLine}`} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
