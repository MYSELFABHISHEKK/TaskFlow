import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-mist p-6 text-center">
      <div>
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400">404</div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Page not found</h1>
        <p className="mt-3 text-neutral-500">That route does not exist in this workspace.</p>
        <Link className="btn-primary mt-6" to="/dashboard">Go dashboard</Link>
      </div>
    </main>
  );
}
