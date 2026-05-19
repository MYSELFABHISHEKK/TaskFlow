import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', text = 'Create the first item to get moving.' }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-xl border border-dashed border-neutral-300 bg-white/60 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-neutral-100 dark:bg-neutral-800"><Inbox size={22} /></div>
        <h3 className="mt-4 font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{text}</p>
      </div>
    </div>
  );
}
