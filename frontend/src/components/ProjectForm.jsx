import { useState } from 'react';

export default function ProjectForm({ project, onSubmit, onCancel }) {
  const [form, setForm] = useState({ title: project?.title || '', description: project?.description || '' });
  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}>
      <div><label className="label">Title</label><input required className="input mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
      <div><label className="label">Description</label><textarea className="input mt-1 min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      <div className="flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button><button className="btn-primary">Save project</button></div>
    </form>
  );
}
