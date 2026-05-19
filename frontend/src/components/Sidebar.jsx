import { BarChart3, FolderKanban, Home, Settings, User, UsersRound, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const baseLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: BarChart3 },
  { to: '/members', label: 'Members', icon: UsersRound, adminOnly: true },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings }
];

const Content = ({ close }) => {
  const { isAdmin } = useAuth();
  const links = baseLinks.filter((link) => !link.adminOnly || isAdmin);

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between px-2 py-3">
        <div>
          <div className="text-lg font-extrabold tracking-tight">TaskFlow</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Team command center</div>
        </div>
        {close && <button onClick={close} className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"><X size={18} /></button>}
      </div>
      <nav className="mt-6 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={close} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'text-neutral-600 hover:bg-white hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white'}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-lg border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="font-semibold">Focus mode</div>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">A clean view for shipping project work with less noise.</p>
      </div>
    </div>
  );
};

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-neutral-200 bg-white/80 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/80 lg:block">
        <Content />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="relative h-full w-72 bg-white shadow-2xl dark:bg-neutral-950">
            <Content close={() => setMobileOpen(false)} />
          </motion.aside>
        </div>
      )}
    </>
  );
}
