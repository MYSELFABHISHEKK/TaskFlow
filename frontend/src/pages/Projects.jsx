import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import ProjectForm from '../components/ProjectForm';
import EmptyState from '../components/EmptyState';

export default function Projects() {
  const { isAdmin } = useAuth();
  const { projects, fetchProjects, saveProject } = useData();
  const [open, setOpen] = useState(false);
  useEffect(() => { fetchProjects(); }, []);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold tracking-tight">Projects</h1><p className="mt-2 text-neutral-500 dark:text-neutral-400">Organize teams, tasks, and milestones.</p></div>
        {isAdmin && <button className="btn-primary" onClick={() => setOpen(true)}><Plus size={18} />New project</button>}
      </div>
      {projects.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <ProjectCard key={project._id} project={project} />)}</div> : <EmptyState title="No projects yet" text="Admins can create the first project." />}
      {open && <Modal title="New project" onClose={() => setOpen(false)}><ProjectForm onCancel={() => setOpen(false)} onSubmit={async (payload) => { await saveProject(payload); setOpen(false); }} /></Modal>}
    </div>
  );
}
