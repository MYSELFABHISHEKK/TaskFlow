import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => localStorage.getItem('taskflow_theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('taskflow_theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-mist/80 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={onMenu} className="rounded-lg p-2 hover:bg-white dark:hover:bg-neutral-900 lg:hidden"><Menu size={20} /></button>
        <div className="hidden text-sm text-neutral-500 dark:text-neutral-400 sm:block">Ship the right work, in the right order.</div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setDark((value) => !value)} className="rounded-lg border border-neutral-200 bg-white p-2 transition hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="hidden items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: user?.avatarColor || '#111827' }}>{user?.name?.[0]}</span>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{user?.name}</div>
              <div className="text-xs capitalize text-neutral-500">{user?.role}</div>
            </div>
          </div>
          <button onClick={logout} className="rounded-lg border border-neutral-200 bg-white p-2 transition hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900"><LogOut size={18} /></button>
        </div>
      </div>
    </header>
  );
}
