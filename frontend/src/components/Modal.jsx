import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-xl rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
          <h2 className="font-semibold">{title}</h2>
          <button className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  );
}
