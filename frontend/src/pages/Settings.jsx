import { Bell, Palette, ShieldCheck } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Settings</h1><p className="mt-2 text-neutral-500 dark:text-neutral-400">Workspace preferences for the product shell.</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        {[['Theme', 'Dark and light mode are available from the top bar.', Palette], ['Notifications', 'Activity notifications are ready for real-time events.', Bell], ['Security', 'JWT sessions, password hashing, and RBAC are enabled.', ShieldCheck]].map(([title, text, Icon]) => (
          <section key={title} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <Icon size={20} />
            <h2 className="mt-4 font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
