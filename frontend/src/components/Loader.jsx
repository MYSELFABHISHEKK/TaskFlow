import { motion } from 'framer-motion';

export default function Loader({ full = false }) {
  return (
    <div className={`grid place-items-center ${full ? 'min-h-screen' : 'min-h-40'}`}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="h-8 w-8 rounded-full border-2 border-neutral-300 border-t-neutral-950 dark:border-neutral-700 dark:border-t-white" />
    </div>
  );
}
